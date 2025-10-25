import { readFileSync } from "fs";
import { join } from "path";
import { db, closePool } from "./postgres";
import { assets, type NewAsset } from "./schemas/asset.drizzle";

/**
 * Seed PostgreSQL with crypto asset data from assets.json
 */

interface AssetJSON {
  _id: { $oid: string };
  id: string;
  __v?: number | { $numberDouble: string };
  ath: number | { $numberDouble: string };
  athChangePercentage: number | { $numberDouble: string };
  athDate: { $date: string } | null;
  atl: number | { $numberDouble: string };
  atlChangePercentage: number | { $numberDouble: string };
  atlDate: { $date: string } | null;
  circulatingSupply: number | { $numberDouble: string };
  createdAt: { $date: string } | null;
  currentPrice: number | { $numberDouble: string };
  fullyDilutedValuation: number | { $numberDouble: string };
  high24h: number | { $numberDouble: string };
  image: string;
  lastUpdated: { $date: string } | null;
  low24h: number | { $numberDouble: string };
  marketCap: number | { $numberDouble: string };
  marketCapChange24h: number | { $numberDouble: string };
  marketCapChangePercentage24h: number | { $numberDouble: string };
  marketCapRank: number | { $numberDouble: string };
  maxSupply: number | null;
  name: string;
  priceChange24h: number | { $numberDouble: string };
  priceChangePercentage1hInCurrency: number | { $numberDouble: string };
  priceChangePercentage1yInCurrency: number | { $numberDouble: string };
  priceChangePercentage24h: number | { $numberDouble: string };
  priceChangePercentage24hInCurrency: number | { $numberDouble: string };
  priceChangePercentage30dInCurrency: number | { $numberDouble: string };
  priceChangePercentage7dInCurrency: number | { $numberDouble: string };
  roi: {
    times: number | { $numberDouble: string };
    currency: string;
    percentage: number | { $numberDouble: string };
  } | null;
  sparklineIn7d: {
    price: number[];
  };
  symbol: string;
  totalSupply: number | { $numberDouble: string };
  totalVolume: number | { $numberDouble: string };
  updatedAt: { $date: string } | null;
  classification?: { $oid: string }[];
  messariCategory?: string;
  messariId?: string;
  messariSector?: string;
  messariTags?: string[];
}

/**
 * Helper to extract number from MongoDB extended JSON format
 */
function extractNumber(
  val: number | { $numberDouble: string } | null | undefined,
): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return val;
  if (typeof val === "object" && "$numberDouble" in val) {
    const parsed = parseFloat(val.$numberDouble);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Transform MongoDB JSON export to PostgreSQL format
 */
function transformAsset(asset: AssetJSON): NewAsset {
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    version: asset.__v,
    currentPrice: extractNumber(asset.currentPrice),
    priceChange24h: extractNumber(asset.priceChange24h),
    priceChangePercentage24h: extractNumber(asset.priceChangePercentage24h),
    priceChangePercentage24hInCurrency: extractNumber(
      asset.priceChangePercentage24hInCurrency,
    ),
    priceChangePercentage1hInCurrency: extractNumber(
      asset.priceChangePercentage1hInCurrency,
    ),
    priceChangePercentage7dInCurrency: extractNumber(
      asset.priceChangePercentage7dInCurrency,
    ),
    priceChangePercentage30dInCurrency: extractNumber(
      asset.priceChangePercentage30dInCurrency,
    ),
    priceChangePercentage1yInCurrency: extractNumber(
      asset.priceChangePercentage1yInCurrency,
    ),
    high24h: extractNumber(asset.high24h),
    low24h: extractNumber(asset.low24h),
    ath: extractNumber(asset.ath),
    athChangePercentage: extractNumber(asset.athChangePercentage),
    athDate: asset.athDate ? new Date(asset.athDate.$date) : new Date(),
    atl: extractNumber(asset.atl),
    atlChangePercentage: extractNumber(asset.atlChangePercentage),
    atlDate: asset.atlDate ? new Date(asset.atlDate.$date) : new Date(),
    marketCap: extractNumber(asset.marketCap),
    marketCapRank:
      typeof asset.marketCapRank === "number" ? asset.marketCapRank : null,
    marketCapChange24h: extractNumber(asset.marketCapChange24h),
    marketCapChangePercentage24h: extractNumber(
      asset.marketCapChangePercentage24h,
    ),
    fullyDilutedValuation: extractNumber(asset.fullyDilutedValuation),
    totalVolume: extractNumber(asset.totalVolume),
    circulatingSupply: extractNumber(asset.circulatingSupply),
    totalSupply: extractNumber(asset.totalSupply),
    maxSupply: extractNumber(asset.maxSupply),
    roi: asset.roi ?? null,
    sparklineIn7d: asset.sparklineIn7d,
    image: asset.image,
    lastUpdated: asset.lastUpdated
      ? new Date(asset.lastUpdated.$date)
      : new Date(),
    createdAt: asset.createdAt ? new Date(asset.createdAt.$date) : new Date(),
    updatedAt: asset.updatedAt ? new Date(asset.updatedAt.$date) : new Date(),
    messariId: asset.messariId,
    messariCategory: asset.messariCategory,
    messariSector: asset.messariSector,
    messariTags: asset.messariTags,
    classificationIds: asset.classification?.map((c) => c.$oid),
  };
}

/**
 * Seed PostgreSQL with assets from JSON file
 * @param options Seeding options
 */
export async function seedPostgreSQL(options?: {
  clearExisting?: boolean;
  batchSize?: number | { $numberDouble: string };
  limit?: number | { $numberDouble: string };
}) {
  const { clearExisting = true, batchSize = 25, limit } = options ?? {};

  try {
    console.log("🌱 Starting PostgreSQL seed...");

    // Clear existing data if requested
    if (clearExisting) {
      await db.delete(assets);
      console.log(`🗑️  Cleared existing assets table`);
    }

    // Read assets.json
    const assetsPath = join(
      process.cwd(),
      "src",
      "server",
      "api",
      "assets",
      "assets.json",
    );
    console.log(`📂 Reading assets from: ${assetsPath}`);

    const rawData = readFileSync(assetsPath, "utf-8");
    let assetsData: AssetJSON[] = JSON.parse(rawData) as AssetJSON[];

    // Limit if specified
    if (limit) {
      assetsData = assetsData.slice(0, limit);
    }

    console.log(`📊 Processing ${assetsData.length} assets...`);

    // Insert in batches for better performance
    let inserted = 0;
    for (let i = 0; i < assetsData.length; i += batchSize) {
      const batch = assetsData.slice(i, i + batchSize);
      const transformedBatch = batch.map(transformAsset);

      await db.insert(assets).values(transformedBatch).onConflictDoNothing();
      inserted += transformedBatch.length;
      console.log(
        `  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}: ${inserted}/${assetsData.length} assets`,
      );
    }

    console.log(`✅ PostgreSQL seeding completed! Inserted ${inserted} assets`);

    // Show some stats
    const totalAssets = await db
      .select({ count: assets._id })
      .from(assets)
      .execute();

    const topAssets = await db
      .select({
        name: assets.name,
        symbol: assets.symbol,
        marketCapRank: assets.marketCapRank,
      })
      .from(assets)
      .orderBy(assets.marketCapRank)
      .limit(5)
      .execute();

    console.log(`\n📈 Database Stats:`);
    console.log(`   Total assets: ${totalAssets.length}`);
    console.log(`   Top 5 by market cap:`);
    topAssets.forEach((asset) => {
      console.log(
        `     ${asset.marketCapRank}. ${asset.name} (${asset.symbol})`,
      );
    });

    return { success: true, inserted };
  } catch (error) {
    console.error("❌ PostgreSQL seeding failed:", error);
    throw error;
  }
}

/**
 * Run seed if called directly
 */
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  seedPostgreSQL({ batchSize: 25 })
    .then(() => {
      console.log("\n✅ Seed completed successfully");
      return closePool();
    })
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seed failed:", error);
      void closePool().then(() => {
        process.exit(1);
      });
    });
}

export default seedPostgreSQL;
