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

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║            INFINITE TABLE WITH ETHERSCAN API V2 QUERIES                   ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates using TanStack Query with Etherscan API V2   ║
 * ║  to fetch blockchain data. Etherscan provides comprehensive APIs for      ║
 * ║  accounts, transactions, tokens, contracts, and more.                     ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • REST API V2 calls to Etherscan                                         ║
 * ║  • Page-based pagination (page/offset)                                    ║
 * ║  • Token transfer history                                                 ║
 * ║  • Support for ERC20, ERC721, ERC1155 tokens                              ║
 * ║                                                                           ║
 * ║  USE CASES:                                                               ║
 * ║  • Token transfer history for any token                                   ║
 * ║  • NFT transaction tracking                                               ║
 * ║  • Account transaction history                                            ║
 * ║  • Contract event logs                                                    ║
 * ║                                                                           ║
 * ║  API KEY:                                                                 ║
 * ║  Set NEXT_PUBLIC_ETHERSCAN_API_KEY in your .env file                      ║
 * ║  Free tier: 5 calls/sec, 100k calls/day                                   ║
 * ║  Get yours at: https://etherscan.io/apis                                  ║
 * ║  Docs: https://docs.etherscan.io/v2-migration                             ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Constants
// ============================================================================

/**
 * Popular token contracts for demo purposes
 */
const TOKEN_CONTRACTS = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
};

// ============================================================================
// Types
// ============================================================================

/**
 * Etherscan API response for ERC20 token transfers
 */
type EtherscanTransfer = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
};

/**
 * Parsed transfer data for display
 */
type TransferData = {
  id: string; // Unique ID: hash-index
  blockNumber: number;
  timestamp: number;
  hash: string;
  from: string;
  to: string;
  value: string; // Human-readable amount
  tokenSymbol: string;
  tokenName: string;
};

type SortField = "blockNumber" | "value" | "timestamp";
type SortOrder = "asc" | "desc";

type HeaderContext = {
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
};

type EtherscanResponse = {
  status: string;
  message: string;
  result: EtherscanTransfer[];
};

type InfiniteQueryResponse = {
  items: TransferData[];
  nextCursor?: number; // Next page number
};

type FetchTransfersParams = {
  cursor?: number; // Page number
  limit: number;
  contractAddress: string;
  address?: string; // Optional: filter by specific address
};

// ============================================================================
// Etherscan API Fetcher Function
// ============================================================================

/**
 * Fetches ERC20 token transfers from Etherscan API V2
 *
 * ETHERSCAN API V2 ENDPOINTS:
 * - Mainnet: https://api.etherscan.io/v2/api
 * - Goerli: https://api-goerli.etherscan.io/v2/api
 * - Sepolia: https://api-sepolia.etherscan.io/v2/api
 *
 * PAGINATION:
 * Etherscan V2 uses page and offset parameters:
 * - page: 1-indexed page number
 * - offset: items per page (max 10,000)
 *
 * RATE LIMITS (Free tier):
 * - 5 calls/second
 * - 100,000 calls/day
 *
 * @param params - Query parameters
 * @returns Promise resolving to parsed transfer data
 */
async function fetchTransfersFromEtherscan(
  params: FetchTransfersParams,
): Promise<InfiniteQueryResponse> {
  const { cursor = 1, limit, contractAddress, address } = params;

  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_ETHERSCAN_API_KEY is not set in environment variables",
    );
  }

  // Build query parameters for V2 API
  const queryParams = new URLSearchParams({
    chainid: "1", // Ethereum mainnet
    module: "account",
    action: "tokentx",
    contractaddress: contractAddress,
    page: cursor.toString(),
    offset: limit.toString(),
    sort: "desc", // Most recent first
    apikey: apiKey,
  });

  // Optional: filter by specific address
  if (address?.trim()) {
    queryParams.append("address", address);
  }

  // Make API request to V2 endpoint
  const response = await fetch(
    `https://api.etherscan.io/v2/api?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Etherscan API request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as EtherscanResponse;

  // Check for API errors
  if (data.status === "0" && data.message !== "No transactions found") {
    throw new Error(`Etherscan API error: ${data.message}`);
  }

  // Handle "No transactions found"
  if (data.status === "0" || !data.result || data.result.length === 0) {
    return {
      items: [],
      nextCursor: undefined,
    };
  }

  // Parse and format transfers
  const items: TransferData[] = data.result.map((transfer, index) => {
    const decimals = parseInt(transfer.tokenDecimal);
    const value = (parseInt(transfer.value) / Math.pow(10, decimals)).toFixed(
      decimals > 6 ? 6 : decimals,
    );

    return {
      id: `${transfer.hash}-${index}`,
      blockNumber: parseInt(transfer.blockNumber),
      timestamp: parseInt(transfer.timeStamp),
      hash: transfer.hash,
      from: transfer.from,
      to: transfer.to,
      value,
      tokenSymbol: transfer.tokenSymbol,
      tokenName: transfer.tokenName,
    };
  });

  // Determine next cursor
  // If we got a full page, there might be more
  const nextCursor = items.length === limit ? cursor + 1 : undefined;

  return {
    items,
    nextCursor,
  };
}

// ============================================================================
// Render Functions
// ============================================================================

const renderRow = (transfer: TransferData, index: number) => {
  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div key={`${transfer.id}-${index}`}>
      <div className="grid grid-cols-6 items-center gap-4 px-4 py-3 text-sm">
        <span className="font-mono text-xs">
          {transfer.blockNumber.toLocaleString()}
        </span>
        <span className="font-mono text-xs text-blue-400">
          {formatAddress(transfer.from)}
        </span>
        <span className="font-mono text-xs text-green-400">
          {formatAddress(transfer.to)}
        </span>
        <span className="font-semibold">
          {parseFloat(transfer.value).toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}{" "}
          {transfer.tokenSymbol}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(transfer.timestamp * 1000).toLocaleString()}
        </span>
        <a
          href={`https://etherscan.io/tx/${transfer.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-purple-400 hover:underline"
        >
          {formatAddress(transfer.hash)}
        </a>
      </div>
    </div>
  );
};

const renderLoadingRow = () => (
  <div>
    <div className="h-4 animate-pulse rounded bg-white/10" />
  </div>
);

const renderEmptyRow = () => (
  <div>
    <td className="px-4 py-8 text-center text-gray-400" colSpan={6}>
      No transfers found for this token.
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
        <span>Block</span>
        <span>From</span>
        <span>To</span>
        <span>Amount</span>
        <span>Time</span>
        <span>Tx Hash</span>
      </div>
    );
  }

  const { sortField, sortOrder, setSortField, setSortOrder } = context;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-400">
      <button
        onClick={() => handleSort("blockNumber")}
        className="text-left transition-colors hover:text-white"
      >
        Block
        <SortIndicator field="blockNumber" />
      </button>
      <span>From</span>
      <span>To</span>
      <button
        onClick={() => handleSort("value")}
        className="text-left transition-colors hover:text-white"
      >
        Amount
        <SortIndicator field="value" />
      </button>
      <button
        onClick={() => handleSort("timestamp")}
        className="text-left transition-colors hover:text-white"
      >
        Time
        <SortIndicator field="timestamp" />
      </button>
      <span>Tx Hash</span>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * InfiniteTableEtherscan
 *
 * Demonstrates infinite scroll table using TanStack Query with Etherscan API
 * for querying blockchain data without running your own node.
 *
 * ETHERSCAN PAGINATION:
 * Uses page-based pagination:
 * - Page 1: Get first 50 items
 * - Page 2: Get next 50 items
 * - etc.
 *
 * ADVANTAGES OVER DIRECT RPC:
 * - No block range limits
 * - Pre-indexed data (faster queries)
 * - Historical data available
 * - Generous rate limits (100k req/day free)
 *
 * LIMITATIONS:
 * - Maximum 10,000 results per query
 * - 5 calls/second rate limit (free tier)
 * - Data may be few seconds behind blockchain
 */
export default function InfiniteTableEtherscan() {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [selectedToken, setSelectedToken] = useState<string>(
    TOKEN_CONTRACTS.USDC,
  );
  const [addressFilter, setAddressFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("blockNumber");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // ==========================================================================
  // INFINITE QUERY WITH ETHERSCAN
  // ==========================================================================

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
      "transfers",
      "etherscan",
      {
        token: selectedToken,
        address: addressFilter || undefined,
      },
    ],
    queryFn: ({ pageParam = 1 }) =>
      fetchTransfersFromEtherscan({
        cursor: pageParam as number,
        limit: 50,
        contractAddress: selectedToken,
        address: addressFilter || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1, // Retry once on failure
  });

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  React.useEffect(() => {
    if (isError && error) {
      toast.error("Failed to fetch Etherscan data", {
        description:
          error.message || "An error occurred while querying Etherscan API",
      });
    }
  }, [isError, error]);

  // ==========================================================================
  // DATA TRANSFORMATION & SORTING
  // ==========================================================================

  const allItems = useMemo(() => {
    const items = tableData?.pages.flatMap((page) => page.items) ?? [];

    // Client-side sorting (Etherscan returns data in desc order by default)
    return items.sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortField) {
        case "blockNumber":
          aVal = a.blockNumber;
          bVal = b.blockNumber;
          break;
        case "value":
          aVal = parseFloat(a.value);
          bVal = parseFloat(b.value);
          break;
        case "timestamp":
          aVal = a.timestamp;
          bVal = b.timestamp;
          break;
        default:
          return 0;
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [tableData, sortField, sortOrder]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* API Key Warning */}
      {!process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY && (
        <div className="rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-yellow-400">
                Etherscan API Key Required
              </h3>
              <p className="text-sm text-gray-300">
                To use this example, you need an Etherscan API key set in your
                .env file.
              </p>
              <p className="text-sm text-gray-300">
                <strong>Get a free API key:</strong>
              </p>
              <ol className="ml-4 list-decimal space-y-1 text-sm text-gray-300">
                <li>
                  Visit{" "}
                  <a
                    href="https://etherscan.io/apis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    etherscan.io/apis
                  </a>
                </li>
                <li>Create a free account</li>
                <li>
                  Add{" "}
                  <code className="rounded bg-black/30 px-2 py-1 font-mono text-xs">
                    ETHERSCAN_API_KEY=your_key_here
                  </code>{" "}
                  to .env
                </li>
              </ol>
              <p className="text-xs text-gray-400">
                Free tier: 5 calls/sec, 100k calls/day
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="rounded-lg bg-white/10 p-6">
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          {/* Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="token">Token Contract</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger id="token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TOKEN_CONTRACTS).map(([symbol, address]) => (
                  <SelectItem key={address} value={address}>
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address Filter */}
          <div className="space-y-2">
            <Label htmlFor="address">Filter by Address (optional)</Label>
            <Input
              id="address"
              type="text"
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
              placeholder="0x..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Click on column headers to sort
          </p>
          <p className="text-xs text-gray-500">
            Data from Etherscan API • Updated every ~15-30 seconds
          </p>
        </div>
      </div>

      {/* Table */}
      <Table<TransferData, HeaderContext>
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
