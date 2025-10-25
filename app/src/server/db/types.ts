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
