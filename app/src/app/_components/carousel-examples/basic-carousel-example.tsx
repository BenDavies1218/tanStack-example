"use client";

import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/Generics/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";
import {
  BasicCarouselItem,
  BasicCarouselItemLoading,
} from "./items/basic";

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
    <div className="space-y-6 rounded-lg border-2 border-black/10 p-6">
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
        renderItem={BasicCarouselItem}
        renderLoadingItem={BasicCarouselItemLoading}
        renderEmptyItem={renderEmptyItem}
        isLoading={isLoading}
        containScroll="trimSnaps"
        loadingCount={3}
        gap={16}
        navigation={{ show: true }}
        dots={{ show: true }}
        loop
        dragFree
        className="rounded-lg border-2 border-black/10 p-4"
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
