/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db/postgres";
import { connectMongoDB } from "@/server/db/mongodb";
import { AssetModel } from "@/server/db/schemas/asset.mongoose";
import { assets } from "@/server/db/schemas/asset.drizzle";
import { sql } from "drizzle-orm";
import { toAssetDTO, type AssetDTO } from "@/types/asset";
import { ethers } from "ethers";

export const queryRouter = createTRPCRouter({
  // Example of a query with sorting parameter from MongoDB
  getDataMongoDb: publicProcedure
    .input(
      z.object({
        sortBy: z
          .enum(["rank", "price", "24hChange", "7dChange", "marketCap"])
          .default("rank"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .query(async ({ input }): Promise<AssetDTO[]> => {
      await connectMongoDB();

      // Map frontend sort keys to database fields
      const sortFieldMap = {
        rank: "marketCapRank",
        price: "currentPrice",
        "24hChange": "priceChangePercentage24h",
        "7dChange": "priceChangePercentage7dInCurrency",
        marketCap: "marketCap",
      } as const;

      const sortField = sortFieldMap[input.sortBy];
      const sortDirection = input.sortOrder === "asc" ? 1 : -1;

      const topAssets = await AssetModel.find()
        .sort({ [sortField]: sortDirection })
        .limit(5)
        .select(
          "_id id name symbol image currentPrice priceChangePercentage24h priceChangePercentage7dInCurrency priceChangePercentage30dInCurrency ath atl marketCap totalVolume circulatingSupply totalSupply marketCapRank messariCategory",
        )
        .lean()
        .exec();

      return topAssets.map((asset) => toAssetDTO(asset));
    }),

  // Example of a simple query that returns top 5 assets from PostgreSQL
  getDataPostgres: publicProcedure.query(async () => {
    const topAssets = await db
      .select({
        _id: assets._id,
        id: assets.id,
        name: assets.name,
        symbol: assets.symbol,
        image: assets.image,
        currentPrice: assets.currentPrice,
        priceChangePercentage24h: assets.priceChangePercentage24h,
        priceChangePercentage7dInCurrency:
          assets.priceChangePercentage7dInCurrency,
        priceChangePercentage30dInCurrency:
          assets.priceChangePercentage30dInCurrency,
        ath: assets.ath,
        atl: assets.atl,
        marketCap: assets.marketCap,
        totalVolume: assets.totalVolume,
        circulatingSupply: assets.circulatingSupply,
        totalSupply: assets.totalSupply,
        marketCapRank: assets.marketCapRank,
        messariCategory: assets.messariCategory,
      })
      .from(assets)
      .orderBy(sql`${assets.marketCapRank} ASC NULLS LAST`)
      .limit(5);

    return topAssets.map((asset) =>
      toAssetDTO({
        _id: asset._id,
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        image: asset.image,
        currentPrice: asset.currentPrice,
        priceChangePercentage24h: asset.priceChangePercentage24h,
        priceChangePercentage7dInCurrency:
          asset.priceChangePercentage7dInCurrency,
        priceChangePercentage30dInCurrency:
          asset.priceChangePercentage30dInCurrency,
        ath: asset.ath,
        atl: asset.atl,
        marketCap: asset.marketCap,
        totalVolume: asset.totalVolume,
        circulatingSupply: asset.circulatingSupply,
        totalSupply: asset.totalSupply,
        marketCapRank: asset.marketCapRank,
        messariCategory: asset.messariCategory,
      }),
    ) satisfies AssetDTO[];
  }),

  // Example of a query that returns an error
  returnErrorFromQuery: publicProcedure.query(async () => {
    throw new Error("This is an intentional error for demonstration purposes");
  }),

  // Example of a query with input validation that fetches a specific asset
  getAdditionalData: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      await connectMongoDB();

      const asset = await AssetModel.findOne({ id: input.id })
        .select(
          "_id id name symbol image currentPrice priceChangePercentage24h priceChangePercentage7dInCurrency priceChangePercentage30dInCurrency ath atl marketCap totalVolume circulatingSupply totalSupply marketCapRank messariCategory",
        )
        .lean()
        .exec();

      if (!asset) {
        throw new Error(`Asset with id ${input.id} not found`);
      }

      return toAssetDTO(asset) satisfies AssetDTO;
    }),

  getEthBalance: publicProcedure.query(async () => {
    const provider = new ethers.JsonRpcProvider(
      "https://eth.llamarpc.com", // Public Ethereum RPC
    );
    const balance = await provider.getBalance(
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    ); // Example: Ethereum Foundation Wallet

    return ethers.formatEther(balance);
  }),
});

export type QueryRouter = typeof queryRouter;
