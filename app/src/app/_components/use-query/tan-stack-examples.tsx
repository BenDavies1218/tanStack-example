"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import type { BlockInfo, NetworkInfo } from "@/types/asset";
import { api } from "@/trpc/react";

// Ethers.js query functions
const fetchNetworkInfo = async (): Promise<NetworkInfo> => {
  const provider = new ethers.JsonRpcProvider(
    "https://eth.llamarpc.com", // Public Ethereum RPC
  );
  const network = await provider.getNetwork();

  return {
    chainId: Number(network.chainId),
    name: network.name,
  };
};

const fetchLatestBlock = async (): Promise<BlockInfo> => {
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");

  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);

  if (!block) {
    throw new Error("Failed to fetch block");
  }

  return {
    number: block.number,
    hash: block.hash ?? "0x0",
    timestamp: block.timestamp,
    gasLimit: block.gasLimit.toString(),
    gasUsed: block.gasUsed.toString(),
    transactions: block.transactions.length,
  };
};

const fetchEthPrice = async (): Promise<number> => {
  // Fetch ETH price from a public API
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ETH price");
  }

  const data = (await response.json()) as { ethereum: { usd: number } };
  return data.ethereum.usd;
};

const TanStackExamples = () => {
  const utils = api.useUtils();
  // Example 1: Query network information using ethers.js
  const {
    data: networkData,
    isLoading: isLoadingNetwork,
    error: networkError,
  } = useQuery({
    queryKey: ["network-info"],
    queryFn: fetchNetworkInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Example 2: Query latest block information
  const {
    data: blockData,
    isLoading: isLoadingBlock,
    error: blockError,
  } = useQuery({
    queryKey: ["latest-block"],
    queryFn: fetchLatestBlock,
    refetchInterval: 12000, // Refetch every 12 seconds (approx. block time)
  });

  // Example 3: Query ETH price
  const {
    data: ethPrice,
    isLoading: isLoadingPrice,
    error: priceError,
  } = useQuery({
    queryKey: ["eth-price"],
    queryFn: fetchEthPrice,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Example 4: Wrapping a polling function for gas prices
  const {
    data: gasPrice,
    isLoading: isLoadingGas,
    error: gasError,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["gas-price"],
    queryFn: async () => {
      const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
      const feeData = await provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice
          ? ethers.formatUnits(feeData.gasPrice, "gwei")
          : "0",
        maxFeePerGas: feeData.maxFeePerGas
          ? ethers.formatUnits(feeData.maxFeePerGas, "gwei")
          : "0",
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
          ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei")
          : "0",
      };
    },
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true, // Continue polling when tab is not focused
    staleTime: 0, // Always consider data stale
  });

  // Example 5: Wrap TRPC query with TanStack Query
  const {
    data: ethBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useQuery({
    queryKey: ["eth-balance"],
    queryFn: async () => {
      const balance = await utils.query.getEthBalance.fetch();
      return balance;

      // Sometimes you might want to a couple of calls or some logic in between calls, wrapping it like this can be useful.
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

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
              <code className="text-sm text-purple-300">queryKey</code>
              <p className="mt-1 text-xs text-gray-400">
                Unique key for caching and tracking queries
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">queryFn</code>
              <p className="mt-1 text-xs text-gray-400">
                Function that returns a Promise (required)
              </p>
            </div>

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
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                refetchOnWindowFocus
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Refetch when window regains focus (default: true)
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
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Note:</strong> TanStack Query requires both{" "}
            <code className="rounded bg-black/30 px-1">queryKey</code> and{" "}
            <code className="rounded bg-black/30 px-1">queryFn</code>. The
            queryKey is used for caching and invalidation, while queryFn is the
            async function that fetches your data.
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          TanStack Query - Basic Query
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const { data, isLoading, error } = useQuery({
  queryKey: ["network-info"],
  queryFn: async () => {
    const provider = new ethers.JsonRpcProvider(url);
    const network = await provider.getNetwork();
    return network;
  },
  staleTime: 5 * 60 * 1000,
});`}
          </pre>
        </div>

        {isLoadingNetwork && (
          <div className="text-yellow-400">Loading network info...</div>
        )}

        {networkError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {networkError.message}
          </div>
        )}

        {networkData && (
          <div className="space-y-2 rounded bg-white/5 p-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Network:</span>
              <span className="font-semibold">{networkData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Chain ID:</span>
              <span className="font-mono">{networkData.chainId}</span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          TanStack Query - Polling Latest Block every 12s
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const { data, isLoading, error } = useQuery({
  queryKey: ["latest-block"],
  queryFn: async () => {
    const provider = new ethers.JsonRpcProvider(url);
    const blockNumber = await provider.getBlockNumber();
    return await provider.getBlock(blockNumber);
  },
  refetchInterval: 12000, // Poll every 12s
});`}
          </pre>
        </div>

        {isLoadingBlock && (
          <div className="text-yellow-400">Loading block info...</div>
        )}

        {blockError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {blockError.message}
          </div>
        )}

        {blockData && (
          <div className="space-y-2 rounded bg-white/5 p-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Block Number:</span>
              <span className="font-semibold">
                #{blockData.number.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hash:</span>
              <span className="font-mono text-xs">
                {blockData.hash.slice(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timestamp:</span>
              <span>
                {new Date(blockData.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transactions:</span>
              <span className="font-semibold">{blockData.transactions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Used:</span>
              <span className="font-mono text-xs">
                {(Number(blockData.gasUsed) / 1e6).toFixed(2)}M
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          TanStack Query - ETH Price from an External REST API
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const { data, isLoading, error } = useQuery({
  queryKey: ["eth-price"],
  queryFn: async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/..."
    );
    return await res.json();
  },
  refetchInterval: 30000,
});`}
          </pre>
        </div>

        {isLoadingPrice && (
          <div className="text-yellow-400">Loading ETH price...</div>
        )}

        {priceError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {priceError.message}
          </div>
        )}

        {ethPrice && (
          <div className="rounded bg-linear-to-r from-purple-900/50 to-blue-900/50 p-6 text-center">
            <div className="text-sm text-gray-400">Current ETH Price</div>
            <div className="text-4xl font-bold">
              ${ethPrice.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Updates every 30 seconds
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 4: Wrapping a Polling Function - Gas Prices
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`// Wrap any async function with polling
const { data, dataUpdatedAt } = useQuery({
  queryKey: ["gas-price"],
  queryFn: async () => {
    const provider = new ethers.JsonRpcProvider(url);
    const feeData = await provider.getFeeData();
    return {
      gasPrice: ethers.formatUnits(feeData.gasPrice, "gwei"),
      maxFeePerGas: ethers.formatUnits(feeData.maxFeePerGas, "gwei"),
      maxPriorityFeePerGas: ethers.formatUnits(
        feeData.maxPriorityFeePerGas,
        "gwei"
      ),
    };
  },
  refetchInterval: 5000, // Poll every 5s
  refetchIntervalInBackground: true, // Poll even when tab unfocused
  staleTime: 0, // Always fetch fresh data
});`}
          </pre>
        </div>

        {isLoadingGas && (
          <div className="text-yellow-400">Loading gas prices...</div>
        )}

        {gasError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {gasError.message}
          </div>
        )}

        {gasPrice && (
          <div className="space-y-3 rounded bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-sm text-gray-400">
                Updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </span>
              <span className="rounded bg-green-900/30 px-2 py-1 text-xs text-green-300">
                Live (5s polling)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Gas Price:</span>
              <span className="font-mono font-semibold">
                {Number(gasPrice.gasPrice).toFixed(2)} Gwei
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Max Fee Per Gas:</span>
              <span className="font-mono font-semibold">
                {Number(gasPrice.maxFeePerGas).toFixed(2)} Gwei
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Max Priority Fee:</span>
              <span className="font-mono font-semibold">
                {Number(gasPrice.maxPriorityFeePerGas).toFixed(2)} Gwei
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 rounded bg-orange-900/20 p-3">
          <p className="text-xs text-orange-200">
            <strong>💡 Polling Pattern:</strong> This example demonstrates how
            to wrap any async function with automatic polling. The{" "}
            <code className="rounded bg-black/30 px-1">refetchInterval</code>{" "}
            option makes TanStack Query call your function repeatedly, and{" "}
            <code className="rounded bg-black/30 px-1">
              refetchIntervalInBackground
            </code>{" "}
            keeps it running even when the browser tab loses focus.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          TanStack Query - Wrapping a TRPC Query or mutation
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const {
    data: ethBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useQuery({
    queryKey: ["eth-balance"],
    queryFn: async () => {
      const balance = await utils.query.getEthBalance.fetch();
      return balance;

      // Sometimes you might want to make a couple of calls that requires a backend secret or some data. other cases include doing some logic to calculate a quote etc., wrapping a trpc query / mutation like this can be very useful.
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });`}
          </pre>
        </div>

        {isLoadingBalance && (
          <div className="text-yellow-400">Loading ETH balance...</div>
        )}

        {balanceError && (
          <div className="rounded bg-red-900/50 p-3 text-red-200">
            Error: {balanceError.message}
          </div>
        )}

        {ethBalance && (
          <div className="rounded bg-linear-to-r from-purple-900/50 to-blue-900/50 p-6 text-center">
            <div className="text-sm text-gray-400">
              Current ETH Balance Ethereum Foundation Wallet
            </div>
            <div className="text-4xl font-bold">
              {ethBalance.toLocaleString()}
              {" ETH"}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Updates every 10 seconds
            </div>
            {isLoadingBalance && "refetching..."}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-green-900/20 p-6">
        <h4 className="mb-2 font-semibold">Key Features:</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
          <li>Direct RPC calls with ethers.js JsonRpcProvider</li>
          <li>Automatic refetching with configurable intervals</li>
          <li>Background data updates with staleTime</li>
          <li>Works with any async function (RPC, REST API, etc.)</li>
          <li>Built-in error handling and loading states</li>
          <li>
            <strong>Polling support:</strong> Wrap any function with
            refetchInterval for automatic updates
          </li>
          <li>
            <strong>Background polling:</strong> Continue updates even when tab
            is not focused
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TanStackExamples;
