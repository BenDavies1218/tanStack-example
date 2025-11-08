import type { AssetDTO } from "@/types/asset";

export const BannerCarouselItem = (asset: AssetDTO) => (
  <div className="flex h-full w-fit cursor-pointer items-center gap-4 rounded-lg border border-white/10 bg-linear-to-r from-white/5 to-white/10 px-6 py-4 transition-all hover:border-white/20 hover:from-white/10 hover:to-white/15">
    {/* Asset Logo */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={asset.image}
      alt={asset.name}
      className="h-10 w-10 shrink-0 rounded-full"
    />

    {/* Asset Info */}
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white">
          {asset.symbol.toUpperCase()}
        </span>
        <span className="text-xs text-gray-400">#{asset.rank}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">
          ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
        <span
          className={`text-xs font-medium ${
            asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {asset["24hChange"] >= 0 ? "▲" : "▼"}{" "}
          {Math.abs(asset["24hChange"]).toFixed(2)}%
        </span>
      </div>
    </div>
  </div>
);

export const BannerCarouselItemLoading = () => (
  <div className="flex h-full items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-6 py-4">
    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
    <div className="flex flex-col gap-2">
      <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
    </div>
  </div>
);
