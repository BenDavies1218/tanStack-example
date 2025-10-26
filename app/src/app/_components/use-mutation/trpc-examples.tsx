"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

interface CryptoAsset {
  name: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
}

const TrpcExamples = () => {
  const [formData, setFormData] = useState<CryptoAsset>({
    name: "",
    symbol: "",
    currentPrice: 0,
    marketCap: 0,
    marketCapRank: 0,
  });

  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  // Example 1: Basic Mutation
  const createMutation = api.mutation.createData.useMutation({
    onSuccess: (data) => {
      console.log("Created successfully:", data);
      // Reset form
      setFormData({
        name: "",
        symbol: "",
        currentPrice: 0,
        marketCap: 0,
        marketCapRank: 0,
      });
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });

  // Example 2: Mutation with Query Invalidation
  const utils = api.useUtils();
  const updateMutation = api.mutation.updateData.useMutation({
    onSuccess: async () => {
      // Invalidate and refetch relevant queries
      await utils.query.getDataPostgres.invalidate();
      await utils.query.getDataMongoDb.invalidate();
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  // Example 3: Mutation with Optimistic Updates
  const deleteMutation = api.mutation.deleteData.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.query.getDataPostgres.cancel();

      // Snapshot the previous value
      const previousData = utils.query.getDataPostgres.getData();

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        utils.query.getDataPostgres.setData(undefined, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      void utils.query.getDataPostgres.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id: updateId,
      ...formData,
    });
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    deleteMutation.mutate({ id: deleteId });
  };

  return (
    <div className="space-y-8">
      {/* useMutation Options Reference */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold">
          useMutation Options Reference
        </h3>
        <p className="mb-4 text-sm text-gray-300">
          All available options that can be passed to{" "}
          <code className="rounded bg-black/30 px-2 py-1">useMutation</code>:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">mutationFn</code>
              <p className="mt-1 text-xs text-gray-400">
                Function that performs the mutation (required)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">mutationKey</code>
              <p className="mt-1 text-xs text-gray-400">
                Optional key for caching and deduplication
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">onMutate</code>
              <p className="mt-1 text-xs text-gray-400">
                Fires before mutation function, perfect for optimistic updates
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">onSuccess</code>
              <p className="mt-1 text-xs text-gray-400">
                Fires when mutation succeeds, receives data
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">onError</code>
              <p className="mt-1 text-xs text-gray-400">
                Fires when mutation fails, receives error
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">onSettled</code>
              <p className="mt-1 text-xs text-gray-400">
                Fires after success or error, useful for cleanup
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">retry</code>
              <p className="mt-1 text-xs text-gray-400">
                Number of retry attempts on failure (default: 0)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">retryDelay</code>
              <p className="mt-1 text-xs text-gray-400">
                Delay between retries in ms or function
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">scope</code>
              <p className="mt-1 text-xs text-gray-400">
                Scope with id to run mutations serially
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">gcTime</code>
              <p className="mt-1 text-xs text-gray-400">
                Garbage collection time for mutation cache
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">networkMode</code>
              <p className="mt-1 text-xs text-gray-400">
                How mutation behaves with network (online/always/offlineFirst)
              </p>
            </div>

            <div className="rounded bg-white/5 p-3">
              <code className="text-sm text-purple-300">meta</code>
              <p className="mt-1 text-xs text-gray-400">
                Custom metadata for the mutation
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Note:</strong> Unlike queries, mutations don&apos;t run
            automatically. Call{" "}
            <code className="rounded bg-black/30 px-1">mutate()</code> or{" "}
            <code className="rounded bg-black/30 px-1">mutateAsync()</code> to
            execute them.
          </p>
        </div>
      </div>

      {/* Example 1: Basic Create Mutation */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 1: Basic Create Mutation
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const createMutation = api.mutation.createData.useMutation({
  onSuccess: (data) => {
    console.log("Created successfully:", data);
  },
  onError: (error) => {
    console.error("Create failed:", error);
  },
});

// Trigger the mutation
createMutation.mutate({
  name: "Bitcoin",
  symbol: "BTC",
  currentPrice: 45000,
  marketCap: 850000000000,
  marketCapRank: 1,
});`}
          </pre>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={2}
                maxLength={10}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Current Price
              </label>
              <input
                type="number"
                value={formData.currentPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPrice: parseFloat(e.target.value),
                  })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={0}
                step="0.01"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Market Cap
              </label>
              <input
                type="number"
                value={formData.marketCap}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    marketCap: parseFloat(e.target.value),
                  })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={0}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Market Cap Rank
              </label>
              <input
                type="number"
                value={formData.marketCapRank}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    marketCapRank: parseInt(e.target.value),
                  })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={0}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-blue-600 px-6 py-2 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Asset"}
          </button>

          {createMutation.isError && (
            <div className="rounded bg-red-900/50 p-3 text-red-200">
              Error: {createMutation.error.message}
            </div>
          )}

          {createMutation.isSuccess && (
            <div className="rounded bg-green-900/50 p-3 text-green-200">
              ✓ Asset created successfully!
            </div>
          )}
        </form>

        <div className="mt-4 rounded bg-green-900/20 p-3">
          <p className="text-xs text-green-200">
            <strong>💡 Pattern:</strong> Basic mutation with{" "}
            <code className="rounded bg-black/30 px-1">onSuccess</code> and{" "}
            <code className="rounded bg-black/30 px-1">onError</code> callbacks.
            The mutation provides{" "}
            <code className="rounded bg-black/30 px-1">isPending</code>,{" "}
            <code className="rounded bg-black/30 px-1">isError</code>, and{" "}
            <code className="rounded bg-black/30 px-1">isSuccess</code> states.
          </p>
        </div>
      </div>

      {/* Example 2: Mutation with Query Invalidation */}
      <div className="rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-900/30 to-blue-900/30 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-cyan-100">
          Example 2: Update Mutation with Query Invalidation
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const utils = api.useUtils();

const updateMutation = api.mutation.updateData.useMutation({
  onSuccess: async () => {
    // Invalidate and refetch relevant queries
    await utils.query.getDataPostgres.invalidate();
    await utils.query.getDataMongoDb.invalidate();
  },
});

// This ensures UI shows fresh data after mutation
updateMutation.mutate({ id: "...", name: "Updated" });`}
          </pre>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Asset ID (UUID)
            </label>
            <input
              type="text"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
              placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
              className="w-full rounded bg-white/10 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                New Name (optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">
                New Symbol (optional)
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                className="w-full rounded bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded bg-cyan-600 px-6 py-2 font-semibold hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? "Updating..." : "Update Asset"}
          </button>

          {updateMutation.isError && (
            <div className="rounded bg-red-900/50 p-3 text-red-200">
              Error: {updateMutation.error.message}
            </div>
          )}

          {updateMutation.isSuccess && (
            <div className="rounded bg-green-900/50 p-3 text-green-200">
              ✓ Asset updated! Related queries invalidated and refetched.
            </div>
          )}
        </form>

        <div className="mt-4 rounded border border-cyan-500/20 bg-cyan-900/20 p-4">
          <p className="mb-2 text-xs text-cyan-200">
            <strong>🔄 Query Invalidation:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-cyan-200/80">
            <li>
              After successful mutation, invalidate related queries with{" "}
              <code className="rounded bg-black/30 px-1">
                utils.queryName.invalidate()
              </code>
            </li>
            <li>TanStack Query automatically refetches invalidated queries</li>
            <li>Ensures UI stays in sync with backend data</li>
            <li>
              Use <code className="rounded bg-black/30 px-1">await</code> to
              wait for refetch completion
            </li>
          </ul>
        </div>
      </div>

      {/* Example 3: Mutation with Optimistic Updates */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 3: Delete Mutation with Optimistic Updates
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const deleteMutation = api.mutation.deleteData.useMutation({
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await utils.query.getDataPostgres.cancel();

    // Snapshot previous value
    const previousData = utils.query.getDataPostgres.getData();

    // Optimistically update UI (remove item)
    utils.query.getDataPostgres.setData(undefined, (old) =>
      old?.filter((item) => item.id !== variables.id)
    );

    // Return context for rollback
    return { previousData };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousData) {
      utils.query.getDataPostgres.setData(
        undefined,
        context.previousData
      );
    }
  },
  onSettled: () => {
    // Refetch after success or error
    void utils.query.getDataPostgres.invalidate();
  },
});`}
          </pre>
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Asset ID to Delete (UUID)
            </label>
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
              className="w-full rounded bg-white/10 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={deleteMutation.isPending}
            className="rounded bg-red-600 px-6 py-2 font-semibold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Asset"}
          </button>

          {deleteMutation.isError && (
            <div className="rounded bg-red-900/50 p-3 text-red-200">
              Error: {deleteMutation.error.message}
              <br />
              <span className="text-xs">
                (Changes were rolled back automatically)
              </span>
            </div>
          )}

          {deleteMutation.isSuccess && (
            <div className="rounded bg-green-900/50 p-3 text-green-200">
              ✓ Asset deleted successfully!
            </div>
          )}
        </form>

        <div className="mt-4 rounded bg-orange-900/20 p-3">
          <p className="mb-2 text-xs text-orange-200">
            <strong>⚡ Optimistic Updates:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-orange-200/80">
            <li>
              <strong>onMutate:</strong> Update UI immediately before mutation
              completes
            </li>
            <li>
              <strong>Cancel queries:</strong> Prevent race conditions with
              ongoing fetches
            </li>
            <li>
              <strong>Snapshot data:</strong> Save current state for potential
              rollback
            </li>
            <li>
              <strong>onError:</strong> Restore previous state if mutation fails
            </li>
            <li>
              <strong>onSettled:</strong> Refetch to ensure data consistency
            </li>
          </ul>
        </div>
      </div>

      {/* Mutation States */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h4 className="mb-3 font-semibold text-purple-200">
          Mutation State Properties:
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">isPending</code>
            <p className="mt-1 text-xs text-gray-400">
              Mutation is currently executing
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">isIdle</code>
            <p className="mt-1 text-xs text-gray-400">
              Mutation is idle or reset
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">isError</code>
            <p className="mt-1 text-xs text-gray-400">
              Mutation encountered an error
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">isSuccess</code>
            <p className="mt-1 text-xs text-gray-400">
              Mutation completed successfully
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">data</code>
            <p className="mt-1 text-xs text-gray-400">
              Response data from successful mutation
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">error</code>
            <p className="mt-1 text-xs text-gray-400">
              Error object if mutation failed
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">reset()</code>
            <p className="mt-1 text-xs text-gray-400">
              Clear mutation state (error/data)
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <code className="text-sm text-purple-300">mutateAsync()</code>
            <p className="mt-1 text-xs text-gray-400">
              Returns a promise for async/await usage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrpcExamples;
