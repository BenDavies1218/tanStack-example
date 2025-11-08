"use client";

import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/Generics/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";
import { BasicCarouselItem, BasicCarouselItemLoading } from "./items/basic";
import {
  InfiniteInputControls,
  type SortField,
  type SortOrder,
} from "./controls/infinite";

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

export default function InfiniteCarouselExample() {
  // STATE
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // INFINITE QUERY
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
      limit: 50,
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

  // DATA TRANSFORMATION
  // Backend handles sorting via sortBy and sortOrder params, so just flatten pages
  const assets = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // RENDER
  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="rounded-lg bg-white/10 p-6">
        <h2 className="mb-2 text-xl font-semibold">
          Infinite Carousel with useInfiniteQuery
        </h2>
        <p className="text-sm text-gray-400">
          Demonstrates cursor-based pagination with automatic loading. Scroll
          near the end of the carousel to automatically fetch the next page.
          Filter by category and search, then sort the results server-side for
          optimal performance.
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
        <InfiniteInputControls
          search={search}
          category={category}
          sortField={sortField}
          sortOrder={sortOrder}
          totalItems={assets.length}
          pagesLoaded={data?.pages.length ?? 0}
          hasNextPage={hasNextPage ?? false}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortFieldChange={setSortField}
          onSortOrderToggle={toggleSortOrder}
        />
      </div>

      {/* Carousel */}
      <Carousel<AssetDTO>
        items={assets}
        renderItem={BasicCarouselItem}
        renderLoadingItem={BasicCarouselItemLoading}
        renderEmptyItem={renderEmptyItem}
        isLoading={isLoading}
        loadingCount={3}
        itemsPerView="auto"
        gap={20}
        navigation={{ show: true, position: "inside" }}
        loop={false}
        dragFree
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isError={isError}
        triggerOffset={3}
        rootMargin="400px"
        className="rounded-lg bg-black/20 px-4 py-8"
        itemClassName="h-80"
      />

      <div className="flex flex-col items-center gap-4 rounded-lg bg-white/10 p-6">
        {!hasNextPage && assets.length > 0 && (
          <div className="text-center text-sm text-gray-400">
            <p className="font-medium">All items loaded</p>
            <p className="mt-1 text-xs">
              You&apos;ve browsed all {assets.length} available assets
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
