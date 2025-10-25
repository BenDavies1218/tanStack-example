import {
  getModelForClass,
  prop,
  index,
  modelOptions,
  type Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

/**
 * MongoDB/Typegoose schema for crypto assets
 * Based on CoinGecko API data structure
 */

// ROI nested object class
export class Roi {
  @prop({ required: true, type: () => Number })
  public times!: number;

  @prop({ required: true, type: () => String })
  public currency!: string;

  @prop({ required: true, type: () => Number })
  public percentage!: number;
}

// Sparkline nested object class
export class Sparkline {
  @prop({ required: true, type: () => [Number] })
  public price!: number[];
}

// Classification reference type (for future use)
export class Classification {
  public _id!: Types.ObjectId;
}

// Main Asset class with compound indexes
@modelOptions({
  schemaOptions: {
    timestamps: true, // Automatically manages createdAt and updatedAt
    collection: "assets",
  },
})
@index({ marketCapRank: 1, currentPrice: -1 })
@index({ symbol: 1, marketCap: -1 })
@index({ messariCategory: 1, marketCapRank: 1 })
export class Asset {
  // Core identifiers
  @prop({ required: true, unique: true, index: true, type: () => String })
  public id!: string; // e.g., "pepe", "tron"

  @prop({ required: true, index: true, type: () => String })
  public symbol!: string;

  @prop({ required: true, type: () => String })
  public name!: string;

  // Price data
  @prop({ index: true, type: () => Number })
  public currentPrice?: number;

  @prop({ type: () => Number })
  public priceChange24h?: number;

  @prop({ type: () => Number })
  public priceChangePercentage24h?: number;

  @prop({ type: () => Number })
  public priceChangePercentage24hInCurrency?: number;

  @prop({ type: () => Number })
  public priceChangePercentage1hInCurrency?: number;

  @prop({ type: () => Number })
  public priceChangePercentage7dInCurrency?: number;

  @prop({ type: () => Number })
  public priceChangePercentage30dInCurrency?: number;

  @prop({ type: () => Number })
  public priceChangePercentage1yInCurrency?: number;

  // 24h high/low
  @prop({ type: () => Number })
  public high24h?: number;

  @prop({ type: () => Number })
  public low24h?: number;

  // All-time high (ATH)
  @prop({ type: () => Number })
  public ath?: number;

  @prop({ type: () => Number })
  public athChangePercentage?: number;

  @prop({ required: true, type: () => Date })
  public athDate!: Date;

  // All-time low (ATL)
  @prop({ type: () => Number })
  public atl?: number;

  @prop({ type: () => Number })
  public atlChangePercentage?: number;

  @prop({ required: true, type: () => Date })
  public atlDate!: Date;

  // Market data
  @prop({ index: true, type: () => Number })
  public marketCap?: number;

  @prop({ index: true, type: () => Number })
  public marketCapRank?: number;

  @prop({ type: () => Number })
  public marketCapChange24h?: number;

  @prop({ type: () => Number })
  public marketCapChangePercentage24h?: number;

  @prop({ type: () => Number })
  public fullyDilutedValuation?: number;

  @prop({ type: () => Number })
  public totalVolume?: number;

  // Supply data
  @prop({ type: () => Number })
  public circulatingSupply?: number;

  @prop({ type: () => Number })
  public totalSupply?: number;

  @prop({ default: null, type: () => Number })
  public maxSupply?: number | null;

  // ROI data (nested object)
  @prop({ type: () => Roi, default: null })
  public roi?: Roi | null;

  // Sparkline data (nested object with array)
  @prop({ type: () => Sparkline })
  public sparklineIn7d?: Sparkline;

  // Image
  @prop({ required: true, type: () => String })
  public image!: string;

  // Timestamps
  @prop({ required: true, type: () => Date })
  public lastUpdated!: Date;

  public createdAt!: Date; // Auto-managed by timestamps
  public updatedAt!: Date; // Auto-managed by timestamps

  // Classification references
  @prop({ ref: () => Classification, type: () => [Types.ObjectId] })
  public classification?: Ref<Classification, Types.ObjectId>[];

  // Messari metadata
  @prop({ type: () => String })
  public messariId?: string;

  @prop({ type: () => String })
  public messariCategory?: string;

  @prop({ type: () => String })
  public messariSector?: string;

  @prop({ type: () => [String] })
  public messariTags?: string[];
}

// Export the model
export const AssetModel = getModelForClass(Asset);

export default AssetModel;
