/* eslint-disable @next/next/no-img-element */
"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

type sortByType = "rank" | "price" | "24hChange" | "7dChange" | "marketCap";

type sortOrderType = "asc" | "desc";

const TrpcExamples = () => {
  const [sortBy, setSortBy] = useState<sortByType>("rank");
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");

  // Example 1: Simple query fetching top 5 assets from PostgreSQL
  const {
    data: postgresData,
    isLoading: isLoadingPostgres,
    error: postgresError,
  } = api.query.getDataPostgres.useQuery();

  // Example 2: Query with sorting parameters from MongoDB
  const {
    data: mongoData,
    isLoading: isLoadingMongo,
    error: mongoError,
  } = api.query.getDataMongoDb.useQuery({ sortBy, sortOrder });

  // Example 3: Query with input parameter - fetch specific asset by ID
  // Uses initialData to show partial data immediately while fetching complete details
  const initialAsset = {
    uniqueId: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    category: "Currency",
    price: 0,
    "24hChange": 0,
    "7dChange": 0,
    "30dChange": 0,
    ath: 0,
    atl: 0,
    marketCap: 0,
    totalVolume: 0,
    circulatingSupply: 0,
    totalSupply: 0,
    rank: 1,
  };

  const {
    data: specificAsset,
    isLoading: isLoadingSpecific,
    error: specificError,
  } = api.query.getAdditionalData.useQuery(
    { id: "bitcoin" },
    {
      initialData: initialAsset, // Show initial data while loading this is cached
      staleTime: 0, // Ensure data is always considered stale and refetches
    },
  );

  // Example 4: Query that demonstrates error handling - displays error
  const { error: displayError } = api.query.returnErrorFromQuery.useQuery(
    undefined,
    {
      retry: false, // Don't retry this query
    },
  );

  const { data: intentionalErrorData } =
    api.query.returnErrorFromQuery.useQuery(undefined, {
      retry: false,
      throwOnError(error, query) {
        console.log("🔴 Query Error (thrown):", error.message);
        console.log("Query Info:", query);
        // show a toast notification or log to an external service here
        return false; // return false to prevent error from causing unhandled runtime error
      },
    });

  console.log("Intentional Error Data:", intentionalErrorData);

  return (
    <div className="space-y-8">
      {/* useQuery Options Reference */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold">
          useQuery Options Reference
        </h3>
        <p className="mb-4 text-sm text-gray-300">
          All available options that can be passed to{" "}
          <code className="rounded bg-black/30 px-2 py-1">useQuery</code>:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">enabled</code>
              <p className="mt-1 text-xs text-gray-400">
                Boolean to enable/disable automatic query execution
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">retry</code>
              <p className="mt-1 text-xs text-gray-400">
                Number of retry attempts or boolean (default: 3)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">retryDelay</code>
              <p className="mt-1 text-xs text-gray-400">
                Delay between retries in ms or function
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">staleTime</code>
              <p className="mt-1 text-xs text-gray-400">
                Time in ms before data becomes stale (default: 0)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">gcTime</code>
              <p className="mt-1 text-xs text-gray-400">
                Garbage collection time for inactive queries (default: 5 min)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">refetchInterval</code>
              <p className="mt-1 text-xs text-gray-400">
                Polling interval in ms (false to disable)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                refetchIntervalInBackground
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Continue polling when window is not focused
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">refetchOnMount</code>
              <p className="mt-1 text-xs text-gray-400">
                Refetch when component mounts (default: true)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                refetchOnWindowFocus
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Refetch when window regains focus (default: true)
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">placeholderData</code>
              <p className="mt-1 text-xs text-gray-400">
                Data to show while query is loading
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">initialData</code>
              <p className="mt-1 text-xs text-gray-400">
                Initial data to populate cache (persists)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">select</code>
              <p className="mt-1 text-xs text-gray-400">
                Transform or select part of query data
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">throwOnError</code>
              <p className="mt-1 text-xs text-gray-400">
                Function to handle errors (return true to throw)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                notifyOnChangeProps
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Array of props that trigger re-render
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">structuralSharing</code>
              <p className="mt-1 text-xs text-gray-400">
                Keep referential identity when data unchanged
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">networkMode</code>
              <p className="mt-1 text-xs text-gray-400">
                How query behaves with network (online/always/offlineFirst)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">meta</code>
              <p className="mt-1 text-xs text-gray-400">
                Custom metadata for the query
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                refetchOnReconnect
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Refetch when network reconnects (default: true)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Note:</strong> With tRPC, you use{" "}
            <code className="rounded bg-black/30 px-1">
              api.router.procedure.useQuery(input, options)
            </code>{" "}
            where the second parameter accepts these options. TRPC useQuery
            handles queryKey and queryFn automatically but can sometimes be less
            reliable when trying to override or read query state during
            optimistic updates.
          </p>
        </div>
      </div>

      {/* Example 1: PostgreSQL Query */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 1: Simple tRPC Query (PostgreSQL)
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const { data, isLoading, error } = api.query.getDataPostgres.useQuery();`}
          </pre>
        </div>

        {isLoadingPostgres && (
          <div className="text-yellow-400">Loading top 5 assets...</div>
        )}

        {postgresError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {postgresError.message}
          </div>
        )}

        {postgresData && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Top 5 assets by market cap rank
            </p>
            <div className="space-y-2">
              {postgresData.map((asset) => (
                <div
                  key={asset.uniqueId}
                  className="flex items-center gap-4 rounded bg-white/5 p-3"
                >
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-gray-400">
                      {asset.symbol.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">${asset.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">
                      Rank #{asset.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Example 2: MongoDB Query with Sorting */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 2: tRPC Query with Input Parameters (MongoDB)
        </h3>

        <p>
          By passing parameters to the query, you can control the sorting
          behavior. The query key is automatically generated based on the input
          parameters.
        </p>

        <div className="my-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const [sortBy, setSortBy] = useState<sortByType>("rank");
const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");

const { data, isLoading, error } =
  api.query.getDataMongoDb.useQuery({ sortBy, sortOrder });`}
          </pre>
        </div>

        {/* Sorting Controls */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-2 block text-sm text-gray-400">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "rank"
                    | "price"
                    | "24hChange"
                    | "7dChange"
                    | "marketCap",
                )
              }
              className="w-full rounded bg-white/10 px-3 py-2 text-white"
            >
              <option value="rank">Market Cap Rank</option>
              <option value="price">Price</option>
              <option value="24hChange">24h Change</option>
              <option value="7dChange">7d Change</option>
              <option value="marketCap">Market Cap</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm text-gray-400">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full rounded bg-white/10 px-3 py-2 text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {isLoadingMongo && (
          <div className="text-yellow-400">Loading data...</div>
        )}

        {mongoError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {mongoError.message}
          </div>
        )}

        {mongoData && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Top 5 assets from MongoDB</p>
            <div className="space-y-2">
              {mongoData.map((asset) => (
                <div
                  key={asset.uniqueId}
                  className="flex items-center gap-4 rounded bg-white/5 p-3"
                >
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-gray-400">
                      {asset.symbol.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">${asset.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">
                      Rank #{asset.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Example 3: Query with Input Parameter + Initial Data */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 3: Query with Input Parameter & initialData
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`// Populate cache with initial data (persists in cache)
const initialAsset = {
  uniqueId: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://...",
  category: "Currency",
  price: 0, // Will be replaced with real data
  // ... other fields default to 0
};

const { data, isLoading, error } =
  api.query.getAdditionalData.useQuery(
    { id: "bitcoin" },
    {
      enabled: !!mongoData,
      initialData: initialAsset, // Cached until real data arrives
      staleTime: 0, // Always refetch to get real data
    }
  );`}
          </pre>
        </div>

        {isLoadingSpecific && (
          <div className="text-yellow-400">Loading Bitcoin data...</div>
        )}

        {specificError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {specificError.message}
          </div>
        )}

        {specificAsset && (
          <div className="rounded bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-4">
              <img
                src={specificAsset.image}
                alt={specificAsset.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex-1">
                <div className="text-lg font-bold">{specificAsset.name}</div>
                <div className="text-sm text-gray-400">
                  {specificAsset.symbol.toUpperCase()} •{" "}
                  {specificAsset.category}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl">
                  ${specificAsset.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  Rank #{specificAsset.rank}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3 text-sm">
              <div>
                <div className="text-gray-400">Market Cap</div>
                <div className="font-semibold">
                  ${specificAsset.marketCap.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-400">24h Change</div>
                <div
                  className={`font-semibold ${
                    specificAsset["24hChange"] >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {specificAsset["24hChange"].toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-gray-400">7d Change</div>
                <div
                  className={`font-semibold ${
                    specificAsset["7dChange"] >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {specificAsset["7dChange"].toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-gray-400">30d Change</div>
                <div
                  className={`font-semibold ${
                    specificAsset["30dChange"] >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {specificAsset["30dChange"].toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoadingSpecific && !specificAsset && !specificError && (
          <div className="text-gray-400">
            Waiting for MongoDB data to enable this query...
          </div>
        )}
      </div>

      {/* Example 4: Error Handling - Display Error */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 4: Error Handling - Display in UI
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const { error } = api.query.returnErrorFromQuery.useQuery(
  undefined,
  { retry: false }
);`}
          </pre>
        </div>

        {displayError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            <div className="font-semibold">❌ Error caught:</div>
            <div className="mt-1">{displayError.message}</div>
          </div>
        )}
      </div>

      {/* Example 5: Error Handling - useEffect for Console Logging */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 5: Error Handling - throwOnError Callback
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {` const { data: intentionalErrorData } =
    api.query.returnErrorFromQuery.useQuery(undefined, {
      retry: false,
      throwOnError(error, query) {
        console.log("🔴 Query Error (thrown):", error.message);
        console.log("Query Info:", query);
        // show a toast notification or log to an external service here
        return false; // return false to prevent error from causing unhandled runtime error
      },
    });`}
          </pre>
        </div>
      </div>

      <div className="rounded-lg bg-blue-900/20 p-6">
        <h4 className="mb-2 font-semibold">Key Features Demonstrated:</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
          <li>
            <strong>Simple queries:</strong> No input parameters needed (Example
            1)
          </li>
          <li>
            <strong>Dynamic sorting:</strong> Type-safe parameters with Zod for
            sorting/filtering (Example 2)
          </li>
          <li>
            <strong>initialData:</strong> Populate cache with initial data that
            persists (Example 3)
          </li>
          <li>
            <strong>Conditional fetching:</strong> Enable/disable queries based
            on conditions (Example 3)
          </li>
          <li>
            <strong>Error display:</strong> Show errors in the UI (Example 4)
          </li>
          <li>
            <strong>Error callbacks:</strong> Handle errors with throwOnError
            callback (Example 5)
          </li>
          <li>
            <strong>End-to-end type safety:</strong> Full TypeScript inference
            from server to client
          </li>
          <li>
            <strong>Automatic caching:</strong> TanStack Query handles caching
            and refetching
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrpcExamples;
