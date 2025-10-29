"use client";

import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/generic-carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                   INFINITE CAROUSEL EXAMPLE                               ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates infinite loading with useInfiniteQuery       ║
 * ║  and the Carousel component. Data is automatically loaded as users        ║
 * ║  scroll near the end via an injected IntersectionObserver.                ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • TanStack Query useInfiniteQuery integration                            ║
 * ║  • Cursor-based pagination (skip/offset pattern)                          ║
 * ║  • Automatic loading via injected IntersectionObserver                    ║
 * ║  • Manual "Load More" button as fallback                                  ║
 * ║  • Search and category filtering                                          ║
 * ║  • Client-side sorting                                                    ║
 * ║  • Real-time item count tracking                                          ║
 * ║  • Loading state for fetching next page                                   ║
 * ║                                                                           ║
 * ║  INFINITE QUERY PATTERN:                                                  ║
 * ║  1. Initial query fetches first page (e.g., 10 items)                     ║
 * ║  2. User navigates through carousel                                       ║
 * ║  3. IntersectionObserver triggers 3 items from end                        ║
 * ║  4. fetchNextPage() automatically called                                  ║
 * ║  5. New items are appended to existing items                              ║
 * ║  6. Repeat until no more data available                                   ║
 * ║                                                                           ║
 * ║  INTERSECTION OBSERVER PATTERN:                                           ║
 * ║  • Observer injected AS A CAROUSEL ITEM between actual items              ║
 * ║  • Placed at triggerOffset position from end (default: 3)                 ║
 * ║  • Uses rootMargin for early triggering (400px before visible)            ║
 * ║  • Same pattern as generic-table.tsx for consistency                      ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Constants
// ============================================================================

const categories = [
  "All",
  "Cryptocurrency",
  "DeFi",
  "NFT",
  "Gaming",
  "Metaverse",
  "Stablecoin",
  "Exchange",
];

type SortField = "rank" | "name" | "price" | "24hChange" | "marketCap";
type SortOrder = "asc" | "desc";

// ============================================================================
// Render Functions
// ============================================================================

const renderItem = (asset: AssetDTO, index: number) => (
  <div className="flex h-full w-72 flex-col rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
    {/* Item Number Badge */}
    <div className="mb-4 flex items-center justify-between">
      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
        #{index + 1}
      </div>
      <div className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
        Rank #{asset.rank}
      </div>
    </div>

    {/* Asset Info */}
    <div className="mb-4 flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.image}
        alt={asset.name}
        className="h-14 w-14 rounded-full ring-2 ring-white/10"
      />
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-lg font-bold">{asset.name}</h3>
        <p className="text-sm text-gray-400">{asset.symbol.toUpperCase()}</p>
      </div>
    </div>

    {/* Price */}
    <div className="mb-4">
      <div className="text-2xl font-bold">
        ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <div
        className={`mt-1 text-sm font-semibold ${
          asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {asset["24hChange"] >= 0 ? "▲" : "▼"}{" "}
        {Math.abs(asset["24hChange"]).toFixed(2)}%
      </div>
    </div>

    {/* Stats */}
    <div className="mt-auto space-y-2 border-t border-white/10 pt-4 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">Market Cap</span>
        <span className="font-medium">
          ${(asset.marketCap / 1e9).toFixed(2)}B
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Category</span>
        <span className="truncate font-medium">{asset.category}</span>
      </div>
    </div>
  </div>
);

const renderLoadingItem = () => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
    <div className="mb-4 flex items-center justify-between">
      <div className="h-6 w-12 animate-pulse rounded-full bg-white/10" />
      <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
    </div>
    <div className="mb-4 flex items-center gap-4">
      <div className="h-14 w-14 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
      </div>
    </div>
    <div className="mb-4">
      <div className="h-8 w-36 animate-pulse rounded bg-white/10" />
      <div className="mt-1 h-5 w-20 animate-pulse rounded bg-white/10" />
    </div>
    <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
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
  <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5">
    <div className="text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <p className="text-xl font-semibold text-gray-300">No Assets Found</p>
      <p className="mt-2 text-sm text-gray-400">
        Try adjusting your search or category filter
      </p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * InfiniteCarouselExample
 *
 * Demonstrates infinite loading pattern with useInfiniteQuery and automatic
 * data fetching via IntersectionObserver injected between carousel items.
 *
 * DATA FLOW:
 * 1. Component mounts → Fetch first page (10 items)
 * 2. User browses carousel → Navigate through loaded items
 * 3. User scrolls near end → IntersectionObserver detects at position -3
 * 4. fetchNextPage() automatically called
 * 5. New page appended → Carousel now has 20 items
 * 6. Repeat step 3-5 until hasNextPage = false
 *
 * INTERSECTION OBSERVER INTEGRATION:
 * • Observer injected as a zero-width CarouselItem (w-0)
 * • Positioned 3 items before the end (configurable via triggerOffset)
 * • 400px rootMargin triggers fetch before element becomes visible
 * • Same pattern as generic-table.tsx for consistent UX
 *
 * FILTERING & SORTING:
 * • Server-side: Category filter (reduces data fetched)
 * • Server-side: Search filter (reduces data fetched)
 * • Client-side: Sorting (sorts all loaded pages)
 *
 * ADVANTAGES:
 * • Efficient: Only load data as needed
 * • Automatic: No manual "Load More" clicks required
 * • Seamless: Data loads before user reaches the end
 * • Flexible: Change filters without reloading all data
 */
export default function InfiniteCarouselExample() {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // ==========================================================================
  // INFINITE QUERY
  // ==========================================================================

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    error,
  } = api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
    {
      limit: 10,
      category: category === "All" ? undefined : category,
      search: search || undefined,
      sortBy: sortField,
      sortOrder,
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
      staleTime: 5 * 60 * 1000,
    },
  );

  // ==========================================================================
  // DATA TRANSFORMATION
  // ==========================================================================

  // Flatten all pages into single array (already in AssetDTO format)
  const allAssets = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  // Client-side sorting (optional - can also be done server-side)
  const sortedAssets = useMemo(() => {
    return [...allAssets].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortField) {
        case "rank":
          aVal = a.rank;
          bVal = b.rank;
          break;
        case "name":
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "24hChange":
          aVal = a["24hChange"];
          bVal = b["24hChange"];
          break;
        case "marketCap":
          aVal = a.marketCap;
          bVal = b.marketCap;
          break;
        default:
          return 0;
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [allAssets, sortField, sortOrder]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="rounded-lg bg-white/10 p-6">
        <h2 className="mb-2 text-xl font-semibold">
          Infinite Carousel with useInfiniteQuery
        </h2>
        <p className="text-sm text-gray-400">
          Demonstrates cursor-based pagination with automatic loading. Scroll
          near the end of the carousel to automatically fetch the next page. You
          can also click &quot;Load More&quot; to manually fetch additional
          pages. Filter by category and search, then sort the results
          client-side.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>• Auto-loads on scroll</span>
          <span>• Free scroll (no snapping)</span>
          <span>• Mouse wheel support</span>
          <span>• Dynamic pagination</span>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg bg-white/10 p-6">
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or symbol..."
            />
          </div>

          {/* Sort Field */}
          <div className="space-y-2">
            <Label htmlFor="sortField">Sort By</Label>
            <div className="flex gap-2">
              <Select
                value={sortField}
                onValueChange={(value) => setSortField(value as SortField)}
              >
                <SelectTrigger id="sortField" className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank">Rank</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="24hChange">24h Change</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={toggleSortOrder} variant="outline" size="icon">
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-400">Total Items:</span>{" "}
              <span className="font-semibold">{sortedAssets.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Pages Loaded:</span>{" "}
              <span className="font-semibold">{data?.pages.length ?? 0}</span>
            </div>
          </div>
          {hasNextPage && (
            <div className="text-xs text-gray-500">More items available</div>
          )}
        </div>
      </div>

      {/* Carousel */}
      <Carousel<AssetDTO>
        items={sortedAssets}
        renderItem={renderItem}
        renderLoadingItem={renderLoadingItem}
        renderEmptyItem={renderEmptyItem}
        isLoading={isLoading}
        loadingCount={3}
        itemsPerView="auto"
        gap={20}
        navigation={{ show: true, position: "inside" }}
        loop={false}
        dragFree
        hasNextPage={hasNextPage}
        fetchNextPage={() => void fetchNextPage()}
        isFetchingNextPage={isFetchingNextPage}
        isError={isError}
        triggerOffset={3}
        rootMargin="400px"
        className="rounded-lg bg-black/20 px-4 py-8"
        itemClassName="h-96"
      />

      {/* Load More Section */}
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white/10 p-6">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            <span>Loading more items...</span>
          </div>
        )}

        {!isLoading && !isFetchingNextPage && hasNextPage && (
          <Button
            onClick={handleLoadMore}
            size="lg"
            className="w-full md:w-auto"
          >
            Load More Items (10 more)
          </Button>
        )}

        {!hasNextPage && sortedAssets.length > 0 && (
          <div className="text-center text-sm text-gray-400">
            <p className="font-medium">All items loaded</p>
            <p className="mt-1 text-xs">
              You&apos;ve browsed all {sortedAssets.length} available assets
            </p>
          </div>
        )}
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="font-semibold text-red-400">Failed to load data</p>
          <p className="mt-1 text-sm text-red-300">
            {error?.message || "An error occurred while fetching carousel data"}
          </p>
        </div>
      )}
    </div>
  );
}
