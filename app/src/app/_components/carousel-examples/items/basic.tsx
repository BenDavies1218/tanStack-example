import type { AssetDTO } from "@/types/asset";

export const BasicCarouselItem = (asset: AssetDTO) => (
  <div className="flex h-full cursor-pointer flex-col rounded-lg border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-6 transition-all hover:border-white/20 hover:from-white/15 hover:to-white/10">
    {/* Asset Header */}
    <div className="mb-4 flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.image}
        alt={asset.name}
        className="h-16 w-16 rounded-full ring-2 ring-white/10"
      />
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-xl font-bold">{asset.name}</h3>
        <p className="text-sm text-gray-400">
          {asset.symbol.toUpperCase()} • #{asset.rank}
        </p>
      </div>
    </div>

    {/* Price Display */}
    <div className="mb-6 text-center">
      <div className="text-3xl font-bold">
        ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <div
        className={`mt-2 text-lg font-semibold ${
          asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {asset["24hChange"] >= 0 ? "▲" : "▼"}{" "}
        {Math.abs(asset["24hChange"]).toFixed(2)}%
      </div>
    </div>

    {/* Stats Grid */}
    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
      <div>
        <div className="text-xs text-gray-400">Market Cap</div>
        <div className="mt-1 font-semibold">
          ${(asset.marketCap / 1e9).toFixed(2)}B
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-400">Volume</div>
        <div className="mt-1 font-semibold">
          ${(asset.totalVolume / 1e9).toFixed(2)}B
        </div>
      </div>
    </div>
  </div>
);

export const BasicCarouselItemLoading = () => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
    <div className="mb-4 flex items-center gap-4">
      <div className="h-16 w-16 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
      </div>
    </div>
    <div className="mb-6 text-center">
      <div className="mx-auto h-10 w-40 animate-pulse rounded bg-white/10" />
      <div className="mx-auto mt-2 h-6 w-24 animate-pulse rounded bg-white/10" />
    </div>
    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
      <div className="h-10 animate-pulse rounded bg-white/10" />
      <div className="h-10 animate-pulse rounded bg-white/10" />
    </div>
  </div>
);
