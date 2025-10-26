"use client";

import Link from "next/link";
import { useState } from "react";
import TrpcExamples from "@/app/_components/use-mutation/trpc-examples";
import TanStackExamples from "@/app/_components/use-mutation/tan-stack-examples";

export default function UseMutationPage() {
  const [activeTab, setActiveTab] = useState<"trpc" | "tanstack">("trpc");

  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-6xl p-6">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">useMutation Examples</h1>
        <p className="mb-8 text-lg text-gray-300">
          Create, update, and delete data with mutations
        </p>

        <div className="mb-8 rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useMutation</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Used for create/update/delete operations and server side-effects
            </li>
            <li>Provides isPending, isError, isSuccess states</li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">onSuccess</code>,{" "}
              <code className="rounded bg-black/30 px-2 py-1">onError</code>,
              and{" "}
              <code className="rounded bg-black/30 px-2 py-1">onSettled</code>{" "}
              callbacks for side-effects
            </li>
            <li>
              Combine with invalidateQueries to refetch data after mutations
            </li>
            <li>
              Use{" "}
              <code className="rounded bg-black/30 px-2 py-1">mutateAsync</code>{" "}
              for promise-based workflows
            </li>
          </ul>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex cursor-pointer gap-4">
          <button
            onClick={() => setActiveTab("trpc")}
            className={`cursor-pointer rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === "trpc"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            tRPC
          </button>
          <button
            onClick={() => setActiveTab("tanstack")}
            className={`cursor-pointer rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === "tanstack"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            TanStack Query
          </button>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white/5 p-6">
          {activeTab === "trpc" && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">tRPC useMutation()</h2>
              <p className="mb-6 text-gray-300">
                tRPC mutations provide end-to-end type safety for your
                create/update/delete operations. Perfect for internal backend
                APIs.
              </p>
              <TrpcExamples />
            </div>
          )}

          {activeTab === "tanstack" && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                TanStack Query - useMutation
              </h2>
              <p className="mb-6 text-gray-300">
                TanStack Query mutations work with any async function - REST
                APIs, GraphQL, or custom logic. Provides powerful patterns for
                handling mutations.
              </p>
              <TanStackExamples />
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-blue-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-blue-300">
              tRPC Mutations
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Auto-generated from backend router definitions</li>
              <li>Full type safety with input/output validation</li>
              <li>Automatic serialization with SuperJSON</li>
              <li>
                Use <code className="rounded bg-black/30 px-1">utils</code> for
                query invalidation
              </li>
              <li>Perfect for internal backend mutations</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-purple-300">
              TanStack Query Mutations
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Manually define mutationFn for any async operation</li>
              <li>Works with REST APIs, GraphQL, or custom logic</li>
              <li>Retry logic with exponential backoff</li>
              <li>Mutation scopes for serial execution</li>
              <li>Perfect for external APIs and custom operations</li>
            </ul>
          </div>
        </div>

        {/* Key Patterns */}
        <div className="mt-8 rounded-lg bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6">
          <h3 className="mb-4 text-xl font-semibold">
            Key Mutation Patterns:
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-green-300">
                Query Invalidation
              </h4>
              <p className="text-sm text-gray-400">
                After mutation success, invalidate related queries to refetch
                fresh data and keep UI in sync
              </p>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-cyan-300">
                Optimistic Updates
              </h4>
              <p className="text-sm text-gray-400">
                Update UI immediately in onMutate, then rollback in onError if
                the mutation fails
              </p>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-purple-300">
                Side Effects
              </h4>
              <p className="text-sm text-gray-400">
                Use onSuccess, onError, and onSettled callbacks to trigger
                actions after mutations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
