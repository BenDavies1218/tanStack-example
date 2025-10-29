"use client";

import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                       BASIC CAROUSEL EXAMPLE                              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates a basic carousel implementation with         ║
 * ║  cryptocurrency assets using TanStack Query and tRPC.                     ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Fetches paginated data from MongoDB via tRPC                           ║
 * ║  • Displays crypto assets in a carousel format                            ║
 * ║  • Navigation with previous/next buttons                                  ║
 * ║  • Pagination dots for direct navigation                                  ║
 * ║  • Loading state with skeleton cards                                      ║
 * ║  • Empty state handling                                                   ║
 * ║                                                                           ║
 * ║  CAROUSEL CONFIGURATION:                                                  ║
 * ║  • Items per view: 3                                                      ║
 * ║  • Gap: 16px                                                              ║
 * ║  • Navigation: Default position                                           ║
 * ║  • Dots: Bottom position                                                  ║
 * ║  • Loop: Enabled                                                          ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Render Functions
// ============================================================================

const renderItem = (asset: AssetDTO) => (
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

const renderLoadingItem = () => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
    {/* Header Skeleton */}
    <div className="mb-4 flex items-center gap-4">
      <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
      </div>
    </div>

    {/* Price Skeleton */}
    <div className="mb-4 space-y-2">
      <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
    </div>

    {/* Stats Skeleton */}
    <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
      <div className="flex justify-between">
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  </div>
);

const renderEmptyItem = () => (
  <div className="flex h-64 items-center justify-center rounded-lg border border-white/10 bg-white/5">
    <div className="text-center">
      <p className="text-lg text-gray-400">No assets available</p>
      <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * BasicCarouselExample
 *
 * A simple carousel showcasing cryptocurrency assets with basic features.
 * Perfect for understanding the fundamentals of the Carousel component.
 *
 * DATA FLOW:
 * 1. Component mounts
 * 2. tRPC query fetches first 12 assets from MongoDB
 * 3. Loading skeletons displayed during fetch
 * 4. Data populates carousel items
 * 5. User can navigate with arrows or dots
 */
export default function BasicCarouselExample() {
  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  const { data, isLoading, isError } =
    api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
      {
        limit: 12,
        sortBy: "rank",
        sortOrder: "asc",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        throwOnError: () => {
          toast.error("Failed to fetch carousel data", {
            description: "An error occurred while fetching carousel data",
          });
          return false;
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    );

  // Get first page of assets (already in AssetDTO format)
  const assets: AssetDTO[] = data?.pages[0]?.items ?? [];

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="rounded-lg bg-white/10 p-6">
        <h2 className="mb-2 text-xl font-semibold">Basic Carousel</h2>
        <p className="text-sm text-gray-400">
          A simple carousel displaying the top 12 cryptocurrencies by market
          cap. Use the navigation arrows, dots, mouse drag, or scroll wheel to
          browse through the assets. Free scrolling enabled for smooth,
          non-snapping movement.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>• 3 items per view</span>
          <span>• Loop enabled</span>
          <span>• Navigation arrows</span>
          <span>• Pagination dots</span>
          <span>• Free scroll (no snapping)</span>
          <span>• Mouse wheel support</span>
        </div>
      </div>

      {/* Carousel */}
      <Carousel<AssetDTO>
        items={assets}
        renderItem={renderItem}
        renderLoadingItem={renderLoadingItem}
        renderEmptyItem={renderEmptyItem}
        isLoading={isLoading}
        containScroll="trimSnaps"
        loadingCount={3}
        itemsPerView={3}
        gap={16}
        navigation={{ show: true }}
        dots={{ show: true }}
        loop
        dragFree
        className="px-4"
        itemClassName="h-80"
      />

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400">
            Failed to load carousel data. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
