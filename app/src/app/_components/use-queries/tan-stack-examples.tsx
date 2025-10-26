"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useState } from "react";

// Types
interface CryptoPrice {
  id: string;
  name: string;
  price: number;
}

// Fetch functions
const fetchAddressBalance = async (address: string): Promise<string> => {
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

const fetchCryptoPrice = async (coinId: string): Promise<CryptoPrice> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch price for ${coinId}`);
  }

  const data = (await response.json()) as Record<string, { usd: number }>;

  return {
    id: coinId,
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    price: data[coinId]?.usd ?? 0,
  };
};

const fetchBlockInfo = async (blockNumber: number) => {
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  const block = await provider.getBlock(blockNumber);

  if (!block) {
    throw new Error(`Block ${blockNumber} not found`);
  }

  return {
    number: block.number,
    hash: block.hash ?? "0x0",
    timestamp: block.timestamp,
    transactions: block.transactions.length,
  };
};

const TanStackExamples = () => {
  // State for dynamic parallel queries
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Vitalik
    "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe", // Ethereum Foundation
  ]);

  const [newAddress, setNewAddress] = useState("");

  // Available addresses for selection
  const availableAddresses = [
    {
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      label: "Vitalik.eth",
    },
    {
      address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
      label: "Ethereum Foundation",
    },
    {
      address: "0x00000000219ab540356cBB839Cbe05303d7705Fa",
      label: "ETH2 Deposit",
    },
    {
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      label: "Binance Wallet",
    },
  ];

  // Example 1: Manual Parallel Queries (Fixed Number)
  const ethereumQuery = useQuery({
    queryKey: ["crypto-price", "ethereum"],
    queryFn: () => fetchCryptoPrice("ethereum"),
    staleTime: 30000,
  });

  const bitcoinQuery = useQuery({
    queryKey: ["crypto-price", "bitcoin"],
    queryFn: () => fetchCryptoPrice("bitcoin"),
    staleTime: 30000,
  });

  const cardanoQuery = useQuery({
    queryKey: ["crypto-price", "cardano"],
    queryFn: () => fetchCryptoPrice("cardano"),
    staleTime: 30000,
  });

  // Example 2: Dynamic Parallel Queries with useQueries
  const addressQueries = useQueries({
    queries: selectedAddresses.map((address) => ({
      queryKey: ["address-balance", address],
      queryFn: () => fetchAddressBalance(address),
      staleTime: 30000,
      enabled: ethers.isAddress(address),
    })),
  });

  // Example 3: useQueries with different query types
  const latestBlockNumber = 21000000; // Approximate current block
  const blockQueries = useQueries({
    queries: [0, 1, 2, 3, 4].map((offset) => ({
      queryKey: ["block", latestBlockNumber - offset],
      queryFn: () => fetchBlockInfo(latestBlockNumber - offset),
      staleTime: 60000, // Blocks don't change
    })),
  });

  const handleAddAddress = () => {
    if (ethers.isAddress(newAddress) && !selectedAddresses.includes(newAddress)) {
      setSelectedAddresses([...selectedAddresses, newAddress]);
      setNewAddress("");
    }
  };

  const handleRemoveAddress = (address: string) => {
    setSelectedAddresses(selectedAddresses.filter((a) => a !== address));
  };

  const toggleAddress = (address: string) => {
    if (selectedAddresses.includes(address)) {
      handleRemoveAddress(address);
    } else {
      setSelectedAddresses([...selectedAddresses, address]);
    }
  };

  // Check if all manual queries are loading
  const allManualLoading =
    ethereumQuery.isLoading && bitcoinQuery.isLoading && cardanoQuery.isLoading;

  // Check if all address queries are loading
  const allAddressLoading = addressQueries.every((q) => q.isLoading);

  // Check if any address query has an error
  const hasAddressError = addressQueries.some((q) => q.error);

  return (
    <div className="space-y-8">
      {/* useQueries Options Reference */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold">
          useQueries Options Reference
        </h3>
        <p className="mb-4 text-sm text-gray-300">
          All available options that can be passed to{" "}
          <code className="rounded bg-black/30 px-2 py-1">useQueries</code>:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">queries</code>
              <p className="mt-1 text-xs text-gray-400">
                Array of query objects (each with queryKey, queryFn, etc.)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">combine</code>
              <p className="mt-1 text-xs text-gray-400">
                Function to combine/transform the results array
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                ...queryOptions
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Each query object accepts all standard useQuery options
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">
                Individual query keys
              </code>
              <p className="mt-1 text-xs text-gray-400">
                Each query maintains its own cache key and state
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Note:</strong> <code className="rounded bg-black/30 px-1">useQueries</code>{" "}
            returns an array of query results in the same order as the queries
            array. Each result has the same properties as{" "}
            <code className="rounded bg-black/30 px-1">useQuery</code> (data,
            isLoading, error, etc.).
          </p>
        </div>
      </div>

      {/* Manual Parallel Queries Example */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 1: Manual Parallel Queries (Fixed Number)
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`// Multiple useQuery hooks execute in parallel
const ethereumQuery = useQuery({
  queryKey: ["crypto-price", "ethereum"],
  queryFn: () => fetchCryptoPrice("ethereum"),
});

const bitcoinQuery = useQuery({
  queryKey: ["crypto-price", "bitcoin"],
  queryFn: () => fetchCryptoPrice("bitcoin"),
});

const cardanoQuery = useQuery({
  queryKey: ["crypto-price", "cardano"],
  queryFn: () => fetchCryptoPrice("cardano"),
});`}
          </pre>
        </div>

        {allManualLoading && (
          <div className="mb-4 text-yellow-400">
            Loading all crypto prices in parallel...
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {/* Ethereum */}
          <div className="rounded bg-white/5 p-4">
            <div className="mb-2 text-sm text-gray-400">Ethereum</div>
            {ethereumQuery.isLoading && (
              <div className="text-xs text-yellow-400">Loading...</div>
            )}
            {ethereumQuery.error && (
              <div className="text-xs text-red-400">
                Error: {ethereumQuery.error.message}
              </div>
            )}
            {ethereumQuery.data && (
              <div className="text-2xl font-bold text-blue-300">
                ${ethereumQuery.data.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Bitcoin */}
          <div className="rounded bg-white/5 p-4">
            <div className="mb-2 text-sm text-gray-400">Bitcoin</div>
            {bitcoinQuery.isLoading && (
              <div className="text-xs text-yellow-400">Loading...</div>
            )}
            {bitcoinQuery.error && (
              <div className="text-xs text-red-400">
                Error: {bitcoinQuery.error.message}
              </div>
            )}
            {bitcoinQuery.data && (
              <div className="text-2xl font-bold text-orange-300">
                ${bitcoinQuery.data.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Cardano */}
          <div className="rounded bg-white/5 p-4">
            <div className="mb-2 text-sm text-gray-400">Cardano</div>
            {cardanoQuery.isLoading && (
              <div className="text-xs text-yellow-400">Loading...</div>
            )}
            {cardanoQuery.error && (
              <div className="text-xs text-red-400">
                Error: {cardanoQuery.error.message}
              </div>
            )}
            {cardanoQuery.data && (
              <div className="text-2xl font-bold text-purple-300">
                ${cardanoQuery.data.price.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded bg-green-900/20 p-3">
          <p className="text-xs text-green-200">
            <strong>✓ Use Case:</strong> When you know exactly how many queries
            you need (fixed number), use multiple{" "}
            <code className="rounded bg-black/30 px-1">useQuery</code> hooks
            side-by-side. They execute in parallel automatically.
          </p>
        </div>
      </div>

      {/* Dynamic Parallel Queries with useQueries */}
      <div className="rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-900/30 to-blue-900/30 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-cyan-100">
          Example 2: Dynamic Parallel Queries with useQueries
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const [addresses, setAddresses] = useState(["0x...", "0x..."]);

// Dynamic number of queries based on addresses array
const addressQueries = useQueries({
  queries: addresses.map((address) => ({
    queryKey: ["address-balance", address],
    queryFn: () => fetchAddressBalance(address),
    staleTime: 30000,
    enabled: ethers.isAddress(address),
  })),
});

// Returns array of results in same order as queries
// addressQueries[0].data, addressQueries[1].data, etc.`}
          </pre>
        </div>

        {/* Address Selection */}
        <div className="mb-4 space-y-3">
          <h4 className="font-semibold text-cyan-200">Select Addresses to Query:</h4>

          <div className="flex flex-wrap gap-2">
            {availableAddresses.map(({ address, label }) => (
              <button
                key={address}
                onClick={() => toggleAddress(address)}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  selectedAddresses.includes(address)
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {selectedAddresses.includes(address) ? "✓ " : ""}
                {label}
              </button>
            ))}
          </div>

          {/* Custom Address Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Add custom address (0x...)"
              className="flex-1 rounded bg-white/10 px-4 py-2 font-mono text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleAddAddress}
              disabled={!ethers.isAddress(newAddress) || selectedAddresses.includes(newAddress)}
              className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <div className="text-xs text-gray-400">
            Currently querying {selectedAddresses.length} address
            {selectedAddresses.length !== 1 ? "es" : ""} in parallel
          </div>
        </div>

        {/* Results */}
        {allAddressLoading && selectedAddresses.length > 0 && (
          <div className="mb-4 text-yellow-400">
            Loading balances for {selectedAddresses.length} addresses...
          </div>
        )}

        {hasAddressError && (
          <div className="mb-4 rounded bg-red-900/50 p-3 text-red-200">
            Some queries encountered errors
          </div>
        )}

        <div className="space-y-3">
          {addressQueries.map((query, index) => {
            const address = selectedAddresses[index];
            const matchingAddress = availableAddresses.find(
              (a) => a.address === address,
            );

            return (
              <div
                key={address}
                className="flex items-center justify-between rounded border border-cyan-500/30 bg-white/5 p-4"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-cyan-200">
                      {matchingAddress?.label ?? "Custom Address"}
                    </span>
                    <button
                      onClick={() => handleRemoveAddress(address!)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="font-mono text-xs text-gray-400">
                    {address?.slice(0, 10)}...{address?.slice(-8)}
                  </div>
                </div>

                <div className="text-right">
                  {query.isLoading && (
                    <div className="text-sm text-yellow-400">Loading...</div>
                  )}
                  {query.error && (
                    <div className="text-sm text-red-400">Error</div>
                  )}
                  {query.data && (
                    <div className="font-mono text-lg font-bold text-cyan-300">
                      {Number(query.data).toFixed(4)} ETH
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded border border-cyan-500/20 bg-cyan-900/20 p-4">
          <p className="mb-2 text-xs text-cyan-200">
            <strong>🔑 Dynamic Query Behavior:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-cyan-200/80">
            <li>Number of queries changes dynamically based on selected addresses</li>
            <li>Each query has its own cache key and state</li>
            <li>Results array maintains same order as queries array</li>
            <li>Adding/removing addresses creates/removes queries automatically</li>
            <li>Each query can have different loading/error/success states</li>
          </ul>
        </div>
      </div>

      {/* useQueries with Different Query Types */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 3: useQueries with Block Data (Map Pattern)
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`// Fetch last 5 blocks in parallel
const latestBlockNumber = 21000000;

const blockQueries = useQueries({
  queries: [0, 1, 2, 3, 4].map((offset) => ({
    queryKey: ["block", latestBlockNumber - offset],
    queryFn: () => fetchBlockInfo(latestBlockNumber - offset),
    staleTime: 60000,
  })),
});`}
          </pre>
        </div>

        <div className="space-y-2">
          {blockQueries.map((query, index) => {
            const blockNumber = latestBlockNumber - index;

            return (
              <div
                key={blockNumber}
                className="flex items-center justify-between rounded bg-white/5 p-3"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono text-sm font-semibold text-purple-300">
                    Block #{blockNumber.toLocaleString()}
                  </div>
                  {query.isLoading && (
                    <div className="text-xs text-yellow-400">Loading...</div>
                  )}
                  {query.error && (
                    <div className="text-xs text-red-400">
                      Error: {query.error.message}
                    </div>
                  )}
                </div>

                {query.data && (
                  <div className="flex gap-4 text-xs text-gray-400">
                    <div>
                      Txns: <span className="font-semibold">{query.data.transactions}</span>
                    </div>
                    <div>
                      Time:{" "}
                      <span className="font-mono">
                        {new Date(query.data.timestamp * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded bg-orange-900/20 p-3">
          <p className="text-xs text-orange-200">
            <strong>💡 Pattern:</strong> Use{" "}
            <code className="rounded bg-black/30 px-1">.map()</code> to
            generate queries from arrays. This works great for fetching
            multiple items by ID, fetching paginated data in parallel, or any
            scenario where you need similar queries with different parameters.
          </p>
        </div>
      </div>

      {/* Comparison and Best Practices */}
      <div className="rounded-lg bg-green-900/20 p-6">
        <h4 className="mb-3 font-semibold text-green-200">
          Manual Parallel vs useQueries - When to Use Each:
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded bg-white/5 p-4">
            <h5 className="mb-2 font-semibold text-green-300">
              Manual Parallel (Multiple useQuery)
            </h5>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
              <li>Number of queries is fixed and known ahead of time</li>
              <li>Each query is logically different</li>
              <li>Simple and straightforward syntax</li>
              <li>Example: Fetching user profile, settings, and notifications</li>
            </ul>
          </div>

          <div className="rounded bg-white/5 p-4">
            <h5 className="mb-2 font-semibold text-cyan-300">
              useQueries (Dynamic Parallel)
            </h5>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
              <li>Number of queries changes dynamically</li>
              <li>Queries follow the same pattern with different parameters</li>
              <li>Generated from arrays or user input</li>
              <li>Example: Fetching data for a dynamic list of user IDs</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>⚠️ Suspense Mode Note:</strong> In React Suspense mode,
            manual parallel queries won&apos;t work as expected. Use{" "}
            <code className="rounded bg-black/30 px-1">useSuspenseQueries</code>{" "}
            instead, or separate components for each{" "}
            <code className="rounded bg-black/30 px-1">useSuspenseQuery</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TanStackExamples;
