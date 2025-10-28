"use client";

import Link from "next/link";
import { useState } from "react";
import TrpcExamples from "@/app/_components/use-infinite-query/trpc-examples";
import TanStackExamples from "@/app/_components/use-infinite-query/tan-stack-examples";

export default function UseInfiniteQueryPage() {
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

        <h1 className="mb-4 text-4xl font-bold">useInfiniteQuery Examples</h1>
        <p className="mb-8 text-lg text-gray-300">
          Infinite scrolling and cursor-based pagination
        </p>

        <div className="mb-8 rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useInfiniteQuery</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Perfect for infinite scrolling and &ldquo;load more&rdquo; patterns
            </li>
            <li>
              Requires{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                getNextPageParam
              </code>{" "}
              to determine the next cursor
            </li>
            <li>
              Provides{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                fetchNextPage()
              </code>{" "}
              and{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                fetchPreviousPage()
              </code>
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">data.pages</code>{" "}
              contains all loaded pages
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">hasNextPage</code>{" "}
              indicates if more data is available
            </li>
            <li>
              Returns undefined for getNextPageParam when no more pages exist
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
              <h2 className="mb-6 text-3xl font-bold">
                tRPC useInfiniteQuery()
              </h2>
              <p className="mb-6 text-gray-300">
                tRPC provides type-safe infinite queries with both MongoDB and
                PostgreSQL backends. Includes filtering, search, and automatic
                infinite scrolling with Intersection Observer.
              </p>
              <TrpcExamples />
            </div>
          )}

          {activeTab === "tanstack" && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                TanStack Query - useInfiniteQuery
              </h2>
              <p className="mb-6 text-gray-300">
                TanStack Query infinite queries work with any async data source.
                This example uses JSONPlaceholder API to demonstrate the core
                concepts.
              </p>
              <TanStackExamples />
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-blue-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-blue-300">
              tRPC Infinite Queries
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Auto-generated from backend router</li>
              <li>Full type safety for cursor and data</li>
              <li>Supports MongoDB and PostgreSQL</li>
              <li>Built-in filtering and search</li>
              <li>Reusable Intersection Observer component</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-purple-300">
              TanStack Query Infinite
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Works with any REST API or data source</li>
              <li>Manual cursor management</li>
              <li>Offset or cursor-based pagination</li>
              <li>Flexible page parameter handling</li>
              <li>Great for external APIs</li>
            </ul>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-8 rounded-lg bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6">
          <h3 className="mb-4 text-xl font-semibold">
            Key Features Demonstrated:
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-green-300">
                Intersection Observer
              </h4>
              <p className="text-sm text-gray-400">
                Reusable component that automatically loads more data when user
                scrolls near the bottom
              </p>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-cyan-300">
                Filtering & Search
              </h4>
              <p className="text-sm text-gray-400">
                Dynamic query parameters with debounced search to prevent
                excessive requests
              </p>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-purple-300">
                Cursor Pagination
              </h4>
              <p className="text-sm text-gray-400">
                Efficient pagination using cursor/offset strategy with MongoDB
                and PostgreSQL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
