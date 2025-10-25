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
  sortBy: z
    .enum(["name", "symbol", "currentPrice", "marketCap", "marketCapRank"])
    .default("marketCapRank"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const carouselRouter = createTRPCRouter({
  getPaginatedTableMongoDb: publicProcedure
    .input(listInputSchema)
    .query(async ({ input }) => {
      const { page, pageSize, search, sortBy, sortOrder } = input;
      const mongoDb = await connectMongoDB();

      const filter: any = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { symbol: { $regex: search, $options: "i" } },
        ];
      }

      const totalItems = await AssetModel.countDocuments(filter);
      const assets = await AssetModel.find(filter)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 } as {
          [key: string]: SortOrder;
        })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      return {
        data: assets,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
      };
    }),

  getPaginatedTablePostgres: publicProcedure
    .input(listInputSchema)
    .query(async ({ input }) => {
      const { page, pageSize, search, sortBy, sortOrder } = input;

      const whereClause = search
        ? or(
            ilike(assets.name, `%${search}%`),
            ilike(assets.symbol, `%${search}%`),
          )
        : undefined;

      const totalItemsResult = await db
        .select({ count: count() })
        .from(assets)
        .where(whereClause);
      const totalItems = Number(totalItemsResult[0]?.count ?? 0);

      const assetsData = await db
        .select()
        .from(assets)
        .where(whereClause)
        .orderBy(
          sortOrder === "asc" ? asc(assets[sortBy]) : desc(assets[sortBy]),
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return {
        data: assetsData,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
      };
    }),
});

export type CarouselRouter = typeof carouselRouter;
