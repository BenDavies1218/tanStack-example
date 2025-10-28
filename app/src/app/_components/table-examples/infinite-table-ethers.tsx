"use client";

import React, { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
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
 * ║          INFINITE TABLE WITH ETHERS.JS PROVIDER QUERIES                   ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates using TanStack Query with ethers.js          ║
 * ║  to fetch blockchain data directly from RPC providers.                    ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Direct blockchain queries via JSON-RPC                                 ║
 * ║  • Block-based pagination (block number as cursor)                        ║
 * ║  • Event log filtering and parsing                                        ║
 * ║  • Smart contract interaction (ERC20, ERC721, etc.)                       ║
 * ║                                                                           ║
 * ║  USE CASES:                                                               ║
 * ║  • Token transfer history                                                 ║
 * ║  • NFT minting/transfer events                                            ║
 * ║  • DEX swap events                                                        ║
 * ║  • Custom contract event logs                                             ║
 * ║                                                                           ║
 * ║  EXAMPLE: Fetching ERC20 Transfer events                                  ║
 * ║  This shows recent transfer events for a given token contract             ║
 * ║                                                                           ║
 * ║  RPC PROVIDER RECOMMENDATIONS:                                            ║
 * ║  ⚠️  Public RPCs have strict rate limits (500-1000 block range)          ║
 * ║  ✅  For production, use:                                                 ║
 * ║      • Infura: https://infura.io (10k blocks, 100k req/day free)         ║
 * ║      • Alchemy: https://alchemy.com (10k blocks, generous limits)        ║
 * ║      • QuickNode: https://quicknode.com (enterprise features)            ║
 * ║                                                                           ║
 * ║  Set NEXT_PUBLIC_ETH_RPC_URL in your .env file                            ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Constants
// ============================================================================

/**
 * Popular ERC20 tokens for demo purposes
 * Replace with your own token addresses
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
 * Parsed ERC20 Transfer event
 */
type TransferEvent = {
  id: string; // Unique ID: txHash-logIndex
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  value: string; // Human-readable amount
  timestamp: number;
  token: string;
};

type SortField = "blockNumber" | "value" | "timestamp";
type SortOrder = "asc" | "desc";

type HeaderContext = {
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
};

type InfiniteQueryResponse = {
  items: TransferEvent[];
  nextCursor?: number; // Next block number to query from
};

type FetchTransfersParams = {
  cursor?: number; // Starting block number
  limit: number;
  tokenAddress: string;
  addressFilter?: string; // Optional: filter by from/to address
};

// ============================================================================
// Ethers Provider Setup
// ============================================================================

/**
 * Get or create ethers provider
 * Uses public RPC endpoints (consider using Infura/Alchemy for production)
 *
 * PROVIDER OPTIONS:
 * 1. JsonRpcProvider - Direct RPC connection
 * 2. InfuraProvider - Infura service
 * 3. AlchemyProvider - Alchemy service
 * 4. CloudflareProvider - Cloudflare gateway
 * 5. AnkrProvider - Ankr service
 */
let cachedProvider: ethers.JsonRpcProvider | null = null;

function getProvider(): ethers.JsonRpcProvider {
  if (cachedProvider) return cachedProvider;

  // Use environment variable or fallback to public RPC
  const rpcUrl =
    process.env.NEXT_PUBLIC_ETH_RPC_URL ??
    "https://eth.llamarpc.com"; // Public RPC (rate limited)

  cachedProvider = new ethers.JsonRpcProvider(rpcUrl);
  return cachedProvider;
}

// ============================================================================
// ERC20 ABI (Transfer event only)
// ============================================================================

/**
 * Minimal ERC20 ABI for Transfer event parsing
 * Full interface: https://eips.ethereum.org/EIPS/eip-20
 */
const ERC20_TRANSFER_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// ============================================================================
// Ethers Fetcher Function
// ============================================================================

/**
 * Fetches Transfer events from blockchain using ethers.js
 *
 * PAGINATION STRATEGY:
 * Uses block numbers as cursor:
 * - Start from latest block
 * - Query events in chunks (500-1000 blocks at a time)
 * - Next cursor = fromBlock - 1
 *
 * PERFORMANCE CONSIDERATIONS:
 * - RPC providers limit block range (typically 1000-10000 blocks)
 * - Public RPCs are more restrictive (often 1000 blocks max)
 * - Too many events in range will cause timeout
 * - Use indexed parameters for better filtering
 *
 * @param params - Query parameters
 * @returns Promise resolving to parsed transfer events
 */
async function fetchTransfersFromChain(
  params: FetchTransfersParams,
): Promise<InfiniteQueryResponse> {
  const provider = getProvider();
  const { cursor, limit, tokenAddress, addressFilter } = params;

  try {
    // Get latest block number if no cursor provided
    const latestBlock = cursor ?? (await provider.getBlockNumber());

    // Query range: Adjusted based on RPC provider limits
    // IMPORTANT: Different providers have vastly different limits:
    // - LlamaRPC Free: 10 blocks only! (extremely restrictive)
    // - Infura Free: 10,000 blocks
    // - Alchemy Free: 10,000 blocks
    // - QuickNode: 10,000+ blocks
    // - Private node: 50,000+ blocks
    //
    // To use this example properly, set NEXT_PUBLIC_ETH_RPC_URL to a better provider
    const BLOCKS_PER_QUERY = 10; // Minimum for free public RPCs like LlamaRPC
    const fromBlock = Math.max(0, latestBlock - BLOCKS_PER_QUERY);
    const toBlock = latestBlock;

    // Create contract interface
    const contract = new ethers.Contract(
      tokenAddress,
      ERC20_TRANSFER_ABI,
      provider,
    );

    // Get decimals once (cache for performance)
    const decimals = await contract.decimals();

    // Build event filter
    const filter = addressFilter
      ? contract.filters.Transfer(addressFilter, null) // From specific address
      : contract.filters.Transfer(); // All transfers

    // Query events
    const logs = await contract.queryFilter(filter, fromBlock, toBlock);

    // Limit logs processed to avoid timeout
    const logsToProcess = logs.slice(0, limit);

    // Parse events
    const events: TransferEvent[] = await Promise.all(
      logsToProcess.map(async (log) => {
        // Get block timestamp
        const block = await log.getBlock();

        // Parse event arguments
        const parsed = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });

        if (!parsed) {
          throw new Error("Failed to parse log");
        }

        // Format value with decimals (already fetched above)
        const value = ethers.formatUnits(
          parsed.args.value as ethers.BigNumberish,
          decimals,
        );

        return {
          id: `${log.transactionHash}-${log.index}`,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          from: parsed.args.from as string,
          to: parsed.args.to as string,
          value,
          timestamp: block.timestamp,
          token: tokenAddress,
        };
      }),
    );

    // Sort by block number (descending - newest first)
    events.sort((a, b) => b.blockNumber - a.blockNumber);

    // Determine next cursor
    const nextCursor =
      events.length >= limit
        ? Math.max(0, fromBlock - 1) // Continue from earlier blocks
        : undefined; // No more data

    return {
      items: events,
      nextCursor,
    };
  } catch (error) {
    console.error("Ethers query error:", error);
    throw new Error(
      `Failed to fetch blockchain data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// ============================================================================
// Render Functions
// ============================================================================

const renderRow = (event: TransferEvent, index: number) => {
  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatValue = (val: string) => {
    const num = parseFloat(val);
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div key={`${event.id}-${index}`}>
      <div className="grid grid-cols-6 items-center gap-4 px-4 py-3 text-sm">
        <span className="font-mono text-xs">{event.blockNumber.toLocaleString()}</span>
        <span className="font-mono text-xs text-blue-400">
          {formatAddress(event.from)}
        </span>
        <span className="font-mono text-xs text-green-400">
          {formatAddress(event.to)}
        </span>
        <span className="font-semibold">{formatValue(event.value)}</span>
        <span className="text-xs text-gray-400">
          {new Date(event.timestamp * 1000).toLocaleTimeString()}
        </span>
        <a
          href={`https://etherscan.io/tx/${event.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-purple-400 hover:underline"
        >
          {formatAddress(event.transactionHash)}
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
      No transfer events found in recent blocks.
    </td>
  </div>
);

// ============================================================================
// Header Component
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
 * InfiniteTableEthers
 *
 * Demonstrates infinite scroll table using TanStack Query with ethers.js
 * for direct blockchain data queries via JSON-RPC.
 *
 * ETHERS.JS PAGINATION:
 * - Uses block numbers as pagination cursor
 * - Queries events in chunks (5000 blocks at a time)
 * - Works backwards from latest block
 *
 * OPTIMIZATION TIPS:
 * - Cache provider instance (done with cachedProvider)
 * - Use indexed event parameters for filtering
 * - Limit block range to avoid RPC timeouts
 * - Consider using WebSocket provider for real-time updates
 * - Use multicall for batching multiple contract calls
 *
 * ALTERNATIVE APPROACHES:
 * - For historical data: Use The Graph subgraph instead
 * - For real-time: Use provider.on('block') for new blocks
 * - For multi-chain: Use viem instead of ethers.js
 */
export default function InfiniteTableEthers() {
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
  // INFINITE QUERY WITH ETHERS
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
      "ethers",
      {
        token: selectedToken,
        address: addressFilter || undefined,
      },
    ],
    queryFn: ({ pageParam }) =>
      fetchTransfersFromChain({
        cursor: pageParam as number | undefined,
        limit: 50,
        tokenAddress: selectedToken,
        addressFilter: addressFilter || undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 12 * 1000, // 12 seconds (~1 Ethereum block time)
    retry: 1, // Retry once on failure
  });

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  React.useEffect(() => {
    if (isError && error) {
      toast.error("Failed to fetch blockchain data", {
        description: error.message || "An error occurred while querying RPC",
      });
    }
  }, [isError, error]);

  // ==========================================================================
  // DATA TRANSFORMATION & SORTING
  // ==========================================================================

  const allItems = useMemo(() => {
    const items = tableData?.pages.flatMap((page) => page.items) ?? [];

    // Client-side sorting (since blockchain data comes in block order)
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
      {/* RPC Provider Warning */}
      {!process.env.NEXT_PUBLIC_ETH_RPC_URL && (
        <div className="rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-yellow-400">
                Using Public RPC - Very Limited!
              </h3>
              <p className="text-sm text-gray-300">
                The default public RPC only allows 10 block queries, which is
                extremely restrictive. You'll only see recent transfers.
              </p>
              <p className="text-sm text-gray-300">
                <strong>For better experience:</strong> Set{" "}
                <code className="rounded bg-black/30 px-2 py-1 font-mono text-xs">
                  NEXT_PUBLIC_ETH_RPC_URL
                </code>{" "}
                in your .env file with an Infura or Alchemy endpoint (free
                tier: 10k block range).
              </p>
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <div>
                  • Infura:{" "}
                  <a
                    href="https://infura.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    infura.io
                  </a>{" "}
                  (100k req/day free)
                </div>
                <div>
                  • Alchemy:{" "}
                  <a
                    href="https://alchemy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    alchemy.com
                  </a>{" "}
                  (generous free tier)
                </div>
              </div>
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
            Data from Ethereum mainnet via JSON-RPC • Real-time updates
          </p>
          <p className="text-xs text-yellow-500">
            Current query: {process.env.NEXT_PUBLIC_ETH_RPC_URL ? "~5000" : "10"}{" "}
            blocks per page
          </p>
        </div>
      </div>

      {/* Table */}
      <Table<TransferEvent, HeaderContext>
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
