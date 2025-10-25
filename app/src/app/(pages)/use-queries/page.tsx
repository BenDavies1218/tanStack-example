"use client";

import Link from "next/link";

export default function UseQueriesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">
          useQueries & Parallel Queries
        </h1>
        <p className="mb-8 text-lg text-gray-300">
          Executing multiple queries in parallel with different approaches
        </p>

        {/* User Selection */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Select Users to Fetch</h2>
        </div>

        {/* Manual Parallel Queries */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Manual Parallel Queries
          </h2>
          <p className="mb-4 text-sm text-gray-300">
            Using multiple useQuery hooks side-by-side (fixed number of queries)
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About Parallel Queries</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              <strong>Manual Parallel:</strong> Use multiple useQuery hooks when
              the number of queries is fixed
            </li>
            <li>
              <strong>useQueries:</strong> Use when the number of queries
              changes dynamically
            </li>
            <li>
              All queries execute in parallel to maximize fetching concurrency
            </li>
            <li>Each query maintains its own loading and error state</li>
            <li>
              <strong>Note:</strong> In Suspense mode, use useSuspenseQueries
              instead
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
