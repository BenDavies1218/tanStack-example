/* eslint-disable @next/next/no-img-element -- We dont know where the image is coming from */
"use client";

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { IntersectionObserver } from "@/app/_components/shared/IntersectionObserver";
import type { AssetDTO } from "@/types/asset";

const TrpcExamples = () => {
  const [mongoDbSource, setMongoDbSource] = useState<"mongodb" | "postgres">(
    "mongodb",
  );
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // MongoDB Infinite Query
  const mongoQuery = api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
    {
      limit: 10,
      category: category === "all" ? undefined : category,
      search: debouncedSearch || undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: mongoDbSource === "mongodb",
    },
  );

  // PostgreSQL Infinite Query
  const postgresQuery = api.infinite.getInfiniteDataPostgres.useInfiniteQuery(
    {
      limit: 10,
      category: category === "all" ? undefined : category,
      search: debouncedSearch || undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: mongoDbSource === "postgres",
    },
  );

  const activeQuery = mongoDbSource === "mongodb" ? mongoQuery : postgresQuery;

  // Flatten all pages into a single array
  const allItems = activeQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = () => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      void activeQuery.fetchNextPage();
    }
  };

  const handleReset = () => {
    setCategory("all");
    setSearch("");
    setDebouncedSearch("");
  };

  return (
    <div className="space-y-8">
      {/* useInfiniteQuery Options Reference */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold">
          useInfiniteQuery Options Reference
        </h3>
        <p className="mb-4 text-sm text-gray-300">
          All available options that can be passed to{" "}
          <code className="rounded bg-black/30 px-2 py-1">
            useInfiniteQuery
          </code>
          :
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">queryKey</code>
              <p className="mt-1 text-xs text-gray-400">
                Unique key for caching (includes input params)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">queryFn</code>
              <p className="mt-1 text-xs text-gray-400">
                Function that fetches a page (receives pageParam)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">getNextPageParam</code>
              <p className="mt-1 text-xs text-gray-400">
                Extract next cursor from last page (required)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                getPreviousPageParam
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Extract previous cursor for bi-directional pagination
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">initialPageParam</code>
              <p className="mt-1 text-xs text-gray-400">
                Starting cursor value (e.g., 0 for offset pagination)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">maxPages</code>
              <p className="mt-1 text-xs text-gray-400">
                Maximum number of pages to keep in cache
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">enabled</code>
              <p className="mt-1 text-xs text-gray-400">
                Control when query should run
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">staleTime</code>
              <p className="mt-1 text-xs text-gray-400">
                Time before data becomes stale
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                refetchOnWindowFocus
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Refetch when window regains focus
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">select</code>
              <p className="mt-1 text-xs text-gray-400">
                Transform or select part of query data
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                ...all useQuery options
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Inherits all standard useQuery options
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">fetchNextPage()</code>
              <p className="mt-1 text-xs text-gray-400">
                Function to load the next page
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Note:</strong>{" "}
            <code className="rounded bg-black/30 px-1">useInfiniteQuery</code>{" "}
            returns <code className="rounded bg-black/30 px-1">data.pages</code>{" "}
            (array of pages) instead of just{" "}
            <code className="rounded bg-black/30 px-1">data</code>. Use{" "}
            <code className="rounded bg-black/30 px-1">
              data.pages.flatMap()
            </code>{" "}
            to get all items.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Infinite Scroll with Filtering & Search
        </h3>

        <div className="mb-4 grid gap-4 md:grid-cols-3">
          {/* Data Source Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Data Source
            </label>
            <select
              value={mongoDbSource}
              onChange={(e) =>
                setMongoDbSource(e.target.value as "mongodb" | "postgres")
              }
              className="w-full rounded bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="mongodb">MongoDB</option>
              <option value="postgres">PostgreSQL</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or symbol..."
              className="w-full rounded bg-white/10 px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded bg-gray-600 px-4 py-2 text-sm hover:bg-gray-700"
          >
            Reset Filters
          </button>
          <button
            onClick={() => void activeQuery.refetch()}
            disabled={activeQuery.isFetching}
            className="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {activeQuery.isFetching ? "Refetching..." : "Refetch"}
          </button>
        </div>

        <div className="mt-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const query = api.infinite.getInfiniteData${
              mongoDbSource === "mongodb" ? "MongoDB" : "Postgres"
            }.useInfiniteQuery(
  {
    limit: 10,
    category: "${category}",
    search: "${debouncedSearch}",
  },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
);

// Access data
const allItems = query.data?.pages.flatMap(page => page.items);

// Load more
query.fetchNextPage();`}
          </pre>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-900/30 to-blue-900/30 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-cyan-100">
            Results ({allItems.length} items loaded)
          </h3>
          <div className="flex items-center gap-3">
            {activeQuery.isFetching && !activeQuery.isFetchingNextPage && (
              <span className="text-sm text-yellow-400">Refetching...</span>
            )}
            {activeQuery.hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={activeQuery.isFetchingNextPage}
                className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-700 disabled:opacity-50"
              >
                {activeQuery.isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>

        {activeQuery.isLoading && (
          <div className="py-8 text-center text-yellow-400">
            Loading initial data...
          </div>
        )}

        {activeQuery.isError && (
          <div className="rounded bg-red-900/50 p-4 text-red-200">
            Error: {activeQuery.error.message}
          </div>
        )}

        {allItems.length === 0 && !activeQuery.isLoading && (
          <div className="py-8 text-center text-gray-400">
            No results found. Try adjusting your filters.
          </div>
        )}

        {/* Asset List */}
        <div className="space-y-2">
          {allItems.map((asset: AssetDTO, index: number) => (
            <div
              key={`${asset.uniqueId}-${index}`}
              className="flex items-center justify-between rounded border border-cyan-500/30 bg-white/5 p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={asset.image ?? ""}
                  alt={asset.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-cyan-200">
                    {asset.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {asset.symbol.toUpperCase()} • Rank #{asset.marketCap}
                    {asset.category && (
                      <span className="ml-2 rounded bg-purple-900/50 px-2 py-0.5 text-xs">
                        {asset.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-lg font-bold text-cyan-300">
                  ${asset.price?.toLocaleString()}
                </div>
                <div
                  className={`text-xs ${
                    (asset["24hChange"] ?? 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {(asset["24hChange"] ?? 0) >= 0 ? "+" : ""}
                  {asset["24hChange"]?.toFixed(2)}% (24h)
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Intersection Observer for Auto-loading */}
        {activeQuery.hasNextPage && !activeQuery.isFetchingNextPage && (
          <IntersectionObserver
            onIntersect={handleLoadMore}
            enabled={!activeQuery.isFetchingNextPage}
            rootMargin="200px"
            className="mt-4 py-4 text-center"
          >
            <div className="rounded bg-cyan-900/30 p-4 text-cyan-200">
              <div className="text-sm">Scroll down to load more...</div>
            </div>
          </IntersectionObserver>
        )}

        {/* Loading Next Page */}
        {activeQuery.isFetchingNextPage && (
          <div className="mt-4 py-4 text-center text-yellow-400">
            Loading more items...
          </div>
        )}

        {/* No More Data */}
        {!activeQuery.hasNextPage && allItems.length > 0 && (
          <div className="mt-4 rounded bg-gray-900/50 p-4 text-center text-gray-400">
            No more items to load
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="rounded-lg bg-green-900/20 p-6">
        <h4 className="mb-3 font-semibold text-green-200">
          Key Concepts Demonstrated:
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Cursor-based Pagination
            </h5>
            <p className="text-xs text-gray-400">
              Uses offset as cursor (cursor = skip value). Each page returns
              nextCursor for the next batch.
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Filtering & Search
            </h5>
            <p className="text-xs text-gray-400">
              Query params change the data source. Debounced search prevents
              excessive requests.
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Intersection Observer
            </h5>
            <p className="text-xs text-gray-400">
              Automatically loads next page when user scrolls near the bottom.
              Reusable component!
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Data Flattening
            </h5>
            <p className="text-xs text-gray-400">
              Use pages.flatMap() to combine all pages into a single array for
              rendering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrpcExamples;
