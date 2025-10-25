import { readFileSync } from "fs";
import { join } from "path";
import { connectMongoDB, disconnectMongoDB } from "./mongodb";
import { AssetModel } from "./schemas/asset.mongoose";

/**
 * Seed MongoDB with crypto asset data from assets.json
 */

interface AssetJSON {
  _id: { $oid: string };
  id: string;
  __v?: number;
  ath: number;
  athChangePercentage: number;
  athDate: { $date: string } | null;
  atl: number;
  atlChangePercentage: number;
  atlDate: { $date: string } | null;
  circulatingSupply: number;
  createdAt: { $date: string } | null;
  currentPrice: number;
  fullyDilutedValuation: number;
  high24h: number;
  image: string;
  lastUpdated: { $date: string } | null;
  low24h: number;
  marketCap: number;
  marketCapChange24h: number;
  marketCapChangePercentage24h: number;
  marketCapRank: number;
  maxSupply: number | null;
  name: string;
  priceChange24h: number;
  priceChangePercentage1hInCurrency: number;
  priceChangePercentage1yInCurrency: number;
  priceChangePercentage24h: number;
  priceChangePercentage24hInCurrency: number;
  priceChangePercentage30dInCurrency: number;
  priceChangePercentage7dInCurrency: number;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  sparklineIn7d: {
    price: number[];
  };
  symbol: string;
  totalSupply: number;
  totalVolume: number;
  updatedAt: { $date: string } | null;
  classification?: { $oid: string }[];
  messariCategory?: string;
  messariId?: string;
  messariSector?: string;
  messariTags?: string[];
}

/**
 * Transform MongoDB JSON export to Mongoose document format
 */
function transformAsset(asset: AssetJSON) {
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    currentPrice: asset.currentPrice,
    priceChange24h: asset.priceChange24h,
    priceChangePercentage24h: asset.priceChangePercentage24h,
    priceChangePercentage24hInCurrency: asset.priceChangePercentage24hInCurrency,
    priceChangePercentage1hInCurrency: asset.priceChangePercentage1hInCurrency,
    priceChangePercentage7dInCurrency: asset.priceChangePercentage7dInCurrency,
    priceChangePercentage30dInCurrency: asset.priceChangePercentage30dInCurrency,
    priceChangePercentage1yInCurrency: asset.priceChangePercentage1yInCurrency,
    high24h: asset.high24h,
    low24h: asset.low24h,
    ath: asset.ath,
    athChangePercentage: asset.athChangePercentage,
    athDate: asset.athDate ? new Date(asset.athDate.$date) : new Date(),
    atl: asset.atl,
    atlChangePercentage: asset.atlChangePercentage,
    atlDate: asset.atlDate ? new Date(asset.atlDate.$date) : new Date(),
    marketCap: asset.marketCap,
    marketCapRank: asset.marketCapRank,
    marketCapChange24h: asset.marketCapChange24h,
    marketCapChangePercentage24h: asset.marketCapChangePercentage24h,
    fullyDilutedValuation: asset.fullyDilutedValuation,
    totalVolume: asset.totalVolume,
    circulatingSupply: asset.circulatingSupply,
    totalSupply: asset.totalSupply,
    maxSupply: asset.maxSupply,
    roi: asset.roi,
    sparklineIn7d: asset.sparklineIn7d,
    image: asset.image,
    lastUpdated: asset.lastUpdated ? new Date(asset.lastUpdated.$date) : new Date(),
    messariId: asset.messariId,
    messariCategory: asset.messariCategory,
    messariSector: asset.messariSector,
    messariTags: asset.messariTags,
  };
}

/**
 * Seed MongoDB with assets from JSON file
 * @param options Seeding options
 */
export async function seedMongoDB(options?: {
  clearExisting?: boolean;
  batchSize?: number;
  limit?: number;
}) {
  const { clearExisting = true, batchSize = 100, limit } = options ?? {};

  try {
    console.log("🌱 Starting MongoDB seed...");

    // Connect to MongoDB
    await connectMongoDB();

    // Clear existing data if requested
    if (clearExisting) {
      const deleteResult = await AssetModel.deleteMany({});
      console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing assets`);
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
    let assets: AssetJSON[] = JSON.parse(rawData) as AssetJSON[];

    // Limit if specified
    if (limit) {
      assets = assets.slice(0, limit);
    }

    console.log(`📊 Processing ${assets.length} assets...`);

    // Insert in batches for better performance
    let inserted = 0;
    let skipped = 0;
    for (let i = 0; i < assets.length; i += batchSize) {
      const batch = assets.slice(i, i + batchSize);
      const transformedBatch = batch.map(transformAsset);

      try {
        const result = await AssetModel.insertMany(transformedBatch, { ordered: false });
        inserted += result.length;
      } catch (error: any) {
        // insertMany throws error even with ordered: false if there are duplicates
        // The successfully inserted documents are still in the database
        if (error.insertedDocs) {
          inserted += error.insertedDocs.length;
          skipped += transformedBatch.length - error.insertedDocs.length;
        }

        // Log first validation error for debugging
        if (error.writeErrors && error.writeErrors[0] && inserted < 100) {
          console.log(`    Error sample: ${error.writeErrors[0].errmsg}`);
        }
      }
      console.log(`  ✓ Processed batch ${Math.floor(i / batchSize) + 1}: ${inserted} inserted, ${skipped} skipped`);
    }

    console.log(`✅ MongoDB seeding completed! Inserted ${inserted} assets`);

    // Show some stats
    const totalAssets = await AssetModel.countDocuments();
    const topAssets = await AssetModel.find()
      .sort({ marketCapRank: 1 })
      .limit(5)
      .select("name symbol marketCapRank");

    console.log(`\n📈 Database Stats:`);
    console.log(`   Total assets: ${totalAssets}`);
    console.log(`   Top 5 by market cap:`);
    topAssets.forEach((asset) => {
      console.log(`     ${asset.marketCapRank}. ${asset.name} (${asset.symbol})`);
    });

    return { success: true, inserted };
  } catch (error) {
    console.error("❌ MongoDB seeding failed:", error);
    throw error;
  }
}

/**
 * Run seed if called directly
 */
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  seedMongoDB({ batchSize: 100 })
    .then(() => {
      console.log("\n✅ Seed completed successfully");
      return disconnectMongoDB();
    })
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seed failed:", error);
      void disconnectMongoDB().then(() => {
        process.exit(1);
      });
    });
}

export default seedMongoDB;
