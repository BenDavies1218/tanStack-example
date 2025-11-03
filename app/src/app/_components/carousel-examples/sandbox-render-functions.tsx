import type { AssetDTO } from "@/types/asset";

// Simple render functions without color customization
// Colors are now applied to the carousel container instead

export function createRenderItem() {
  return (asset: AssetDTO) => (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
      {/* Asset Header */}
      <div className="mb-4 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.image}
          alt={asset.name}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-1 overflow-hidden">
          <h3 className="truncate text-lg font-semibold">{asset.name}</h3>
          <p className="text-sm text-gray-400">
            {asset.symbol.toUpperCase()} • Rank #{asset.rank}
          </p>
        </div>
      </div>

      {/* Price Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span
            className={`text-sm font-medium ${
              asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {asset["24hChange"] >= 0 ? "+" : ""}
            {asset["24hChange"].toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Market Cap</span>
          <span className="font-medium">
            ${(asset.marketCap / 1e9).toFixed(2)}B
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Volume (24h)</span>
          <span className="font-medium">
            ${(asset.totalVolume / 1e9).toFixed(2)}B
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Category</span>
          <span className="font-medium">{asset.category}</span>
        </div>
      </div>
    </div>
  );
}

export function createRenderLoadingItem() {
  return () => (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
        <div className="flex justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function createRenderEmptyItem() {
  return () => (
    <div className="flex h-64 items-center justify-center rounded-lg border border-white/10 bg-white/5">
      <div className="text-center">
        <p className="text-lg text-gray-400">No assets available</p>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
      </div>
    </div>
  );
}
