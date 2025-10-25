import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db/postgres";
import { connectMongoDB } from "@/server/db/mongodb";
import { AssetModel } from "@/server/db/schemas/asset.mongoose";
import { assets } from "@/server/db/schemas/asset.drizzle";
import { count, asc, desc, or, ilike } from "drizzle-orm";
import type { SortOrder } from "mongoose";

// Input schema for pagination and filtering
const listInputSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["name", "symbol", "currentPrice", "marketCap", "marketCapRank"]).default("marketCapRank"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const assetRouter = createTRPCRouter({
  getCount: publicProcedure.query(async () => {
    // Get count from PostgreSQL (Drizzle)
    const postgresResult = await db
      .select({ count: count() })
      .from(assets);

    // Ensure MongoDB is connected
    await connectMongoDB();

    // Get count from MongoDB (Mongoose)
    const mongoCount = await AssetModel.countDocuments();

    const postgresCount = Number(postgresResult[0]?.count ?? 0);

    return {
      postgres: postgresCount,
      mongo: mongoCount,
      total: postgresCount + mongoCount,
    };
  }),

  listPostgres: publicProcedure
    .input(listInputSchema)
    .query(async ({ input }) => {
      const { page, pageSize, search, sortBy, sortOrder } = input;
      const offset = (page - 1) * pageSize;

      // Build where clause for search
      const whereClause = search
        ? or(
            ilike(assets.name, `%${search}%`),
            ilike(assets.symbol, `%${search}%`)
          )
        : undefined;

      // Build order by clause
      const orderByColumn = assets[sortBy];
      const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

      // Get total count
      const totalResult = await db
        .select({ count: count() })
        .from(assets)
        .where(whereClause);

      const total = Number(totalResult[0]?.count ?? 0);

      // Get paginated data
      const data = await db
        .select({
          id: assets.id,
          name: assets.name,
          symbol: assets.symbol,
          image: assets.image,
          currentPrice: assets.currentPrice,
          priceChange24h: assets.priceChange24h,
          priceChangePercentage24h: assets.priceChangePercentage24h,
          marketCap: assets.marketCap,
          marketCapRank: assets.marketCapRank,
        })
        .from(assets)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset);

      return {
        assets: data,
        total,
        pageCount: Math.ceil(total / pageSize),
        page,
        pageSize,
      };
    }),

  listMongo: publicProcedure
    .input(listInputSchema)
    .query(async ({ input }) => {
      const { page, pageSize, search, sortBy, sortOrder } = input;
      const skip = (page - 1) * pageSize;

      // Ensure MongoDB is connected
      await connectMongoDB();

      // Build search filter
      const searchFilter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { symbol: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      // Build sort object
      const sortObject: Record<string, SortOrder> = {
        [sortBy]: (sortOrder === "asc" ? 1 : -1) as SortOrder
      };

      // Get total count
      const total = await AssetModel.countDocuments(searchFilter);

      // Get paginated data
      const data = await AssetModel.find(searchFilter)
        .select("id name symbol image currentPrice priceChange24h priceChangePercentage24h marketCap marketCapRank")
        .sort(sortObject)
        .skip(skip)
        .limit(pageSize)
        .lean();

      return {
        assets: data,
        total,
        pageCount: Math.ceil(total / pageSize),
        page,
        pageSize,
      };
    }),
});
