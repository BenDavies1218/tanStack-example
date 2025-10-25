/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  pgTable,
  text,
  doublePrecision,
  timestamp,
  integer,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * PostgreSQL/Drizzle schema for crypto assets
 * Based on CoinGecko API data structure
 */

// TypeScript types for JSONB fields
export type Roi = {
  times: number;
  currency: string;
  percentage: number;
};

export type Sparkline = {
  price: number[];
};

export const assets = pgTable("assets", {
  // Primary key - using serial for PostgreSQL auto-increment
  _id: serial("_id").primaryKey(),

  // Core identifiers
  id: text("id").notNull().unique(), // e.g., "pepe", "tron"
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),

  // Version field (from MongoDB __v)
  version: integer("__v").default(0),

  // Price data
  currentPrice: doublePrecision("current_price"),
  priceChange24h: doublePrecision("price_change_24h"),
  priceChangePercentage24h: doublePrecision("price_change_percentage_24h"),
  priceChangePercentage24hInCurrency: doublePrecision(
    "price_change_percentage_24h_in_currency",
  ),
  priceChangePercentage1hInCurrency: doublePrecision(
    "price_change_percentage_1h_in_currency",
  ),
  priceChangePercentage7dInCurrency: doublePrecision(
    "price_change_percentage_7d_in_currency",
  ),
  priceChangePercentage30dInCurrency: doublePrecision(
    "price_change_percentage_30d_in_currency",
  ),
  priceChangePercentage1yInCurrency: doublePrecision(
    "price_change_percentage_1y_in_currency",
  ),

  // 24h high/low
  high24h: doublePrecision("high_24h"),
  low24h: doublePrecision("low_24h"),

  // All-time high (ATH)
  ath: doublePrecision("ath"),
  athChangePercentage: doublePrecision("ath_change_percentage"),
  athDate: timestamp("ath_date", { mode: "date" }).notNull(),

  // All-time low (ATL)
  atl: doublePrecision("atl"),
  atlChangePercentage: doublePrecision("atl_change_percentage"),
  atlDate: timestamp("atl_date", { mode: "date" }).notNull(),

  // Market data
  marketCap: doublePrecision("market_cap"),
  marketCapRank: integer("market_cap_rank"),
  marketCapChange24h: doublePrecision("market_cap_change_24h"),
  marketCapChangePercentage24h: doublePrecision(
    "market_cap_change_percentage_24h",
  ),
  fullyDilutedValuation: doublePrecision("fully_diluted_valuation"),
  totalVolume: doublePrecision("total_volume"),

  // Supply data
  circulatingSupply: doublePrecision("circulating_supply"),
  totalSupply: doublePrecision("total_supply"),
  maxSupply: doublePrecision("max_supply"),

  // ROI data (stored as JSONB for nested object)
  roi: jsonb("roi").$type<Roi | null>(),

  // Sparkline data (stored as JSONB for array of prices)
  sparklineIn7d: jsonb("sparkline_in_7d").$type<Sparkline | null>(),

  // Image
  image: text("image").notNull(),

  // Messari metadata
  messariId: text("messari_id"),
  messariCategory: text("messari_category"),
  messariSector: text("messari_sector"),
  messariTags: jsonb("messari_tags").$type<string[]>(),

  // Classification references (stored as array of IDs)
  classificationIds: jsonb("classification_ids").$type<string[]>(),

  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  lastUpdated: timestamp("last_updated", { mode: "date" }).notNull(),
});

// Zod schemas for validation
export const insertAssetSchema = createInsertSchema(assets);
export const selectAssetSchema = createSelectSchema(assets);

// Type exports
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

// Export a helper function for creating assets with proper typing and validation
export const createAsset = (data: NewAsset) => {
  return insertAssetSchema.parse(data);
};
