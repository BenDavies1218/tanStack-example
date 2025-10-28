"use client";

import React, { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Table } from "@/app/_components/generic-table";
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
 * ║           INFINITE TABLE WITH NATIVE TANSTACK QUERY                       ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates using native TanStack Query's               ║
 * ║  useInfiniteQuery without tRPC. It fetches data directly from            ║
 * ║  API endpoints and handles pagination manually.                          ║
 * ║                                                                           ║
 * ║  KEY DIFFERENCES FROM TRPC VERSION:                                      ║
 * ║  • Uses fetch() to call REST API endpoints                               ║
 * ║  • Manual URL construction with query parameters                         ║
 * ║  • No automatic type inference (types must be explicitly defined)        ║
 * ║  • Error handling via response.ok checks                                 ║
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

// ============================================================================
// Types
// ============================================================================

type SortField =
  | "rank"
  | "name"
  | "price"
  | "24hChange"
  | "marketCap"
  | "totalVolume";
type SortOrder = "asc" | "desc";

type HeaderContext = {
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
};

/**
 * API Response type for paginated data
 */
type InfiniteQueryResponse = {
  items: AssetDTO[];
  nextCursor?: number;
};

/**
 * Query parameters for the API call
 */
type FetchAssetsParams = {
  cursor?: number;
  limit: number;
  category?: string;
  search?: string;
  sortBy: SortField;
  sortOrder: SortOrder;
};

// ============================================================================
// API Fetcher Function
// ============================================================================

/**
 * Fetches assets from the API with pagination and filtering
 *
 * This function constructs the URL with query parameters and makes
 * a fetch request to the backend API endpoint.
 *
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Promise resolving to paginated asset data
 */
async function fetchAssets(
  params: FetchAssetsParams,
): Promise<InfiniteQueryResponse> {
  const { cursor = 0, limit, category, search, sortBy, sortOrder } = params;

  // Construct query parameters
  const queryParams = new URLSearchParams({
    cursor: cursor.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  // Add optional parameters only if they exist
  if (category && category !== "all") {
    queryParams.append("category", category);
  }
  if (search?.trim()) {
    queryParams.append("search", search);
  }

  // Make the API request
  const response = await fetch(
    `/api/assets/infinite?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// Render Functions
// ============================================================================

const renderRow = (asset: AssetDTO, index: number) => (
  <div key={`${asset.uniqueId}-${index}`}>
    <div className="grid grid-cols-6 items-center gap-4 px-4 py-3 text-sm">
      <span>{asset.rank}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.image}
        alt={asset.name}
        className="h-8 w-8 rounded-full"
      />
      <span>
        {asset.name} ({asset.symbol})
      </span>
      <span>${asset.price.toFixed(2)}</span>
      <span
        className={asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"}
      >
        {asset["24hChange"].toFixed(2)}%
      </span>
      <span>{asset.category}</span>
    </div>
  </div>
);

const renderLoadingRow = () => (
  <div>
    <div className="h-4 animate-pulse rounded bg-white/10" />
  </div>
);

const renderEmptyRow = () => (
  <div>
    <td className="px-4 py-8 text-center text-gray-400" colSpan={6}>
      No assets found. Try adjusting your filters.
    </td>
  </div>
);

// ============================================================================
// Header Component with Sorting Controls
// ============================================================================

const renderHeader = (context: HeaderContext | undefined) => {
  if (!context) {
    return (
      <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-400">
        <span>Rank</span>
        <span>Logo</span>
        <span>Name</span>
        <span>Price</span>
        <span>24h %</span>
        <span>Category</span>
      </div>
    );
  }

  const { sortField, sortOrder, setSortField, setSortOrder } = context;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field with ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-400">
      <button
        onClick={() => handleSort("rank")}
        className="text-left transition-colors hover:text-white"
      >
        Rank
        <SortIndicator field="rank" />
      </button>
      <span>Logo</span>
      <button
        onClick={() => handleSort("name")}
        className="text-left transition-colors hover:text-white"
      >
        Name
        <SortIndicator field="name" />
      </button>
      <button
        onClick={() => handleSort("price")}
        className="text-left transition-colors hover:text-white"
      >
        Price
        <SortIndicator field="price" />
      </button>
      <button
        onClick={() => handleSort("24hChange")}
        className="text-left transition-colors hover:text-white"
      >
        24h %<SortIndicator field="24hChange" />
      </button>
      <span>Category</span>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * InfiniteTableTanStack
 *
 * Demonstrates infinite scroll table using native TanStack Query's useInfiniteQuery
 * WITHOUT tRPC. This component makes direct HTTP requests to REST API endpoints.
 *
 * FEATURES:
 * • Native useInfiniteQuery hook from @tanstack/react-query
 * • Direct fetch() calls to API endpoints
 * • Backend sorting and filtering
 * • Interactive column headers for sorting
 * • Category and search filtering
 * • Error handling with toast notifications
 *
 * QUERY KEY STRUCTURE:
 * ["assets", "infinite", { category, search, sortBy, sortOrder }]
 * - Changes to any parameter trigger a new query
 *
 * PAGINATION:
 * - Uses cursor-based pagination (offset)
 * - getNextPageParam extracts nextCursor from response
 * - fetchNextPage() triggered by IntersectionObserver in Table component
 */
export default function InfiniteTableTanStack() {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // ==========================================================================
  // INFINITE QUERY
  // ==========================================================================

  /**
   * useInfiniteQuery configuration:
   *
   * queryKey: Includes all filter/sort params so query re-runs when they change
   * queryFn: Called with pageParam (cursor) for pagination
   * initialPageParam: Starting cursor value (0)
   * getNextPageParam: Extracts nextCursor from last page response
   */
  const {
    data: tableData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteQuery<InfiniteQueryResponse, Error>({
    queryKey: [
      "assets",
      "infinite",
      {
        category: category === "all" ? undefined : category,
        search: search || undefined,
        sortBy: sortField,
        sortOrder,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchAssets({
        cursor: pageParam as number,
        limit: 50,
        category: category === "all" ? undefined : category,
        search: search || undefined,
        sortBy: sortField,
        sortOrder,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry failed requests
  });

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  /**
   * Show toast notification when query errors
   * Separate from query config for better React rendering control
   */
  React.useEffect(() => {
    if (isError && error) {
      toast.error("Failed to fetch table data", {
        description: error.message || "An error occurred while fetching data",
      });
    }
  }, [isError, error]);

  // ==========================================================================
  // DATA TRANSFORMATION
  // ==========================================================================

  /**
   * Flatten all pages into a single array
   * useMemo prevents unnecessary recalculation on every render
   */
  const allItems = useMemo(
    () => tableData?.pages.flatMap((page) => page.items) ?? [],
    [tableData],
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* ====================================================================== */}
      {/* CONTROLS SECTION                                                      */}
      {/* ====================================================================== */}
      <div className="rounded-lg bg-white/10 p-6">
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or symbol..."
            />
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Click on column headers to sort
        </p>
      </div>

      {/* ====================================================================== */}
      {/* TABLE SECTION                                                         */}
      {/* ====================================================================== */}
      <Table<AssetDTO, HeaderContext>
        data={allItems}
        isError={isError}
        triggerOffset={20}
        isLoading={isLoading}
        pageLimit={50}
        renderRow={renderRow}
        hasNextPage={hasNextPage}
        renderHeader={renderHeader}
        renderHeaderContext={{
          sortField,
          sortOrder,
          setSortField,
          setSortOrder,
        }}
        fetchNextPage={fetchNextPage}
        renderEmptyRow={renderEmptyRow}
        renderLoadingRow={renderLoadingRow}
        isFetchingNextPage={isFetchingNextPage}
        className="max-h-[800px]"
      />
    </div>
  );
}
