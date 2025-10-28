import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db/postgres";
import { connectMongoDB } from "@/server/db/mongodb";
import { AssetModel } from "@/server/db/schemas/asset.mongoose";
import { assets } from "@/server/db/schemas/asset.drizzle";
import { sql } from "drizzle-orm";
import { toAssetDTO, type AssetDTO } from "@/types/asset";

const ITEMS_PER_PAGE = 10;

export const infiniteQueryRouter = createTRPCRouter({
  // MongoDB infinite query with filtering and search
  getInfiniteDataMongoDB: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(), // Skip value for pagination
        limit: z.number().min(1).max(100).default(ITEMS_PER_PAGE),
        category: z.string().optional(), // Filter by messariCategory
        search: z.string().optional(), // Search by name or symbol
        sortBy: z
          .enum([
            "rank",
            "name",
            "price",
            "24hChange",
            "marketCap",
            "totalVolume",
          ])
          .default("rank"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .query(async ({ input }) => {
      await connectMongoDB();

      const { cursor = 0, limit, category, search, sortBy, sortOrder } = input;

      // Build filter query
      const filter: Record<string, unknown> = {};

      if (category && category !== "all") {
        filter.messariCategory = category;
      }

      if (search?.trim()) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { symbol: { $regex: search, $options: "i" } },
        ];
      }

      // Map sortBy to MongoDB field names
      const sortFieldMap: Record<string, string> = {
        rank: "marketCapRank",
        name: "name",
        price: "currentPrice",
        "24hChange": "priceChangePercentage24h",
        marketCap: "marketCap",
        totalVolume: "totalVolume",
      };

      const sortField = sortFieldMap[sortBy] ?? "marketCapRank";
      const sortDirection = sortOrder === "asc" ? 1 : -1;

      // Fetch items with cursor-based pagination
      const items = await AssetModel.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(cursor)
        .limit(limit + 1) // Fetch one extra to check if there's a next page
        .select(
          "_id id name symbol image currentPrice priceChangePercentage24h priceChangePercentage7dInCurrency priceChangePercentage30dInCurrency ath atl marketCap totalVolume circulatingSupply totalSupply marketCapRank messariCategory",
        )
        .lean()
        .exec();

      let nextCursor: number | undefined = undefined;

      if (items.length > limit) {
        // Remove the extra item
        items.pop();
        // Next cursor is current cursor + limit
        nextCursor = cursor + limit;
      }

      return {
        items: items.map((item) => toAssetDTO(item)),
        nextCursor,
      };
    }),

  // PostgreSQL infinite query with filtering and search
  getInfiniteDataPostgres: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(), // Skip value for pagination
        limit: z.number().min(1).max(100).default(ITEMS_PER_PAGE),
        category: z.string().optional(), // Filter by messariCategory
        search: z.string().optional(), // Search by name or symbol
        sortBy: z
          .enum([
            "rank",
            "name",
            "price",
            "24hChange",
            "marketCap",
            "totalVolume",
          ])
          .default("rank"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .query(async ({ input }) => {
      const { cursor = 0, limit, category, search, sortBy, sortOrder } = input;

      // Build where conditions
      const conditions = [];

      if (category && category !== "all") {
        conditions.push(sql`${assets.messariCategory} = ${category}`);
      }

      if (search?.trim()) {
        conditions.push(
          sql`(LOWER(${assets.name}) LIKE ${`%${search.toLowerCase()}%`} OR LOWER(${assets.symbol}) LIKE ${`%${search.toLowerCase()}%`})`,
        );
      }

      // Combine conditions
      const whereClause =
        conditions.length > 0
          ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
          : sql``;

      // Map sortBy to PostgreSQL column names (as raw SQL fragments)
      const sortFieldMap: Record<string, string> = {
        rank: "market_cap_rank",
        name: "name",
        price: "current_price",
        "24hChange": "price_change_percentage_24h",
        marketCap: "market_cap",
        totalVolume: "total_volume",
      };

      const sortField = sortFieldMap[sortBy] ?? "market_cap_rank";
      const sortDirection = sortOrder === "asc" ? "ASC" : "DESC";

      // Fetch items with cursor-based pagination
      const items = await db.execute<AssetDTO>(
        sql`
          SELECT
            _id,
            id,
            name,
            symbol,
            image,
            current_price as "currentPrice",
            price_change_percentage_24h as "priceChangePercentage24h",
            price_change_percentage_7d_in_currency as "priceChangePercentage7dInCurrency",
            price_change_percentage_30d_in_currency as "priceChangePercentage30dInCurrency",
            ath,
            atl,
            market_cap as "marketCap",
            total_volume as "totalVolume",
            circulating_supply as "circulatingSupply",
            total_supply as "totalSupply",
            market_cap_rank as "marketCapRank",
            messari_category as "messariCategory"
          FROM ${assets}
          ${whereClause}
          ORDER BY ${sql.raw(sortField)} ${sql.raw(sortDirection)} NULLS LAST
          LIMIT ${limit + 1}
          OFFSET ${cursor}
        `,
      );

      let nextCursor: number | undefined = undefined;

      if (items.rows.length > limit) {
        // Remove the extra item
        items.rows.pop();
        // Next cursor is current cursor + limit
        nextCursor = cursor + limit;
      }

      return {
        items: items.rows.map((item) => toAssetDTO(item)),
        nextCursor,
      };
    }),
});

export type InfiniteQueryRouter = typeof infiniteQueryRouter;
