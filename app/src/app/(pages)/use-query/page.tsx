"use client";

import Link from "next/link";
import { useState } from "react";
import TrpcExamples from "@/app/_components/use-query/trpc-examples";
import TanStackExamples from "@/app/_components/use-query/tan-stack-examples";

export default function UseQueryPage() {
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

        <h1 className="mb-4 text-4xl font-bold">useQuery Examples</h1>
        <p className="mb-8 text-lg text-gray-300">
          Comparing tRPC and TanStack Query for data fetching
        </p>

        <div className="mb-8 rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useQuery</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>Automatically fetches data when component mounts</li>
            <li>Provides loading, error, and success states</li>
            <li>Automatically caches data and manages refetching</li>
            <li>Returns stale data while refetching in background</li>
            <li>Supports polling, background refetching, and more</li>
          </ul>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab("trpc")}
            className={`rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === "trpc"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            tRPC + useQuery
          </button>
          <button
            onClick={() => setActiveTab("tanstack")}
            className={`rounded-lg px-6 py-3 font-semibold transition-all ${
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
                tRPC with TanStack Query
              </h2>
              <p className="mb-6 text-gray-300">
                tRPC wraps TanStack Query to provide end-to-end type safety.
                Perfect for fetching data from your backend API.
              </p>
              <TrpcExamples />
            </div>
          )}

          {activeTab === "tanstack" && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                TanStack Query with Ethers.js
              </h2>
              <p className="mb-6 text-gray-300">
                TanStack Query can wrap any async function - RPC calls, REST
                APIs, or any other data source. Here we use it with ethers.js
                for blockchain queries.
              </p>
              <TanStackExamples />
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-blue-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-blue-300">
              tRPC Benefits
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>End-to-end type safety (no codegen needed)</li>
              <li>Automatic serialization with SuperJSON</li>
              <li>Type inference for inputs/outputs</li>
              <li>Built on TanStack Query (all features included)</li>
              <li>Perfect for internal backend APIs</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-purple-300">
              TanStack Query Benefits
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Works with any async data source</li>
              <li>Blockchain RPC calls, REST APIs, GraphQL</li>
              <li>Framework agnostic (React, Vue, Solid, etc.)</li>
              <li>Powerful caching and synchronization</li>
              <li>Perfect for external APIs and RPC calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
