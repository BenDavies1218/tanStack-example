"use client";

import React, { useMemo, useState } from "react";
import { api } from "@/trpc/react";
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

export default function InfiniteTableExample() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Infinite Query with backend sorting
  const {
    data: tableData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
  } = api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
    {
      limit: 50,
      category: category === "all" ? undefined : category,
      search: search ?? undefined,
      sortBy: sortField,
      sortOrder,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      throwOnError: () => {
        toast.error("Failed to fetch Table data", {
          description: "An error occurred while fetching Table data",
        });
        return false;
      },
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  );

  const allItems = useMemo(
    () => tableData?.pages.flatMap((page) => page.items) ?? [],
    [tableData],
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
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
        <p className="text-sm text-gray-400">Click on column headers to sort</p>
      </div>

      {/* Table */}
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
