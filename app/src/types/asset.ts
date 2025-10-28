/**
 * Asset Data Transfer Object
 * Used for displaying cryptocurrency asset information
 */
export type AssetDTO = {
  uniqueId: string;
  name: string;
  symbol: string;
  category: string;
  image: string;
  price: number;
  "24hChange": number;
  "7dChange": number;
  "30dChange": number;
  ath: number;
  atl: number;
  marketCap: number;
  totalVolume: number;
  circulatingSupply: number;
  totalSupply: number;
  rank: number;
};

/**
 * Helper to map database asset to AssetDTO
 */
export function toAssetDTO(asset: {
  _id?: unknown;
  id?: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice?: number | null;
  priceChangePercentage24h?: number | null;
  priceChangePercentage7dInCurrency?: number | null;
  priceChangePercentage30dInCurrency?: number | null;
  ath?: number | null;
  atl?: number | null;
  marketCap?: number | null;
  totalVolume?: number | null;
  circulatingSupply?: number | null;
  totalSupply?: number | null;
  marketCapRank?: number | null;
  messariCategory?: string | null;
}): AssetDTO {
  return {
    uniqueId: asset.id ?? asset._id?.toString() ?? "",
    name: asset.name,
    symbol: asset.symbol,
    category: asset.messariCategory ?? "Unknown",
    image: asset.image,
    price: asset.currentPrice ?? 0,
    "24hChange": asset.priceChangePercentage24h ?? 0,
    "7dChange": asset.priceChangePercentage7dInCurrency ?? 0,
    "30dChange": asset.priceChangePercentage30dInCurrency ?? 0,
    ath: asset.ath ?? 0,
    atl: asset.atl ?? 0,
    marketCap: asset.marketCap ?? 0,
    totalVolume: asset.totalVolume ?? 0,
    circulatingSupply: asset.circulatingSupply ?? 0,
    totalSupply: asset.totalSupply ?? 0,
    rank: asset.marketCapRank ?? 0,
  };
}

/**
 * Blockchain Network Info (for ethers.js examples)
 */
export type NetworkInfo = {
  chainId: number;
  name: string;
  ensAddress?: string;
};

/**
 * Ethereum Block Info (for ethers.js examples)
 */
export type BlockInfo = {
  number: number;
  hash: string;
  timestamp: number;
  gasLimit: string;
  gasUsed: string;
  transactions: number;
};
