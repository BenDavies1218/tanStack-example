import Link from "next/link";
import TanStackExamples from "@/app/_components/use-queries/tan-stack-examples";

export default function UseQueriesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-6xl p-6">
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

        <div className="mb-8 rounded-lg bg-white/5 p-6">
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

        <div>
          <h2 className="mb-6 text-3xl font-bold">
            TanStack Query - useQueries
          </h2>
          <p className="mb-6 text-gray-300">
            TanStack Query provides powerful patterns for parallel data
            fetching. Use manual parallel queries for fixed numbers, or
            useQueries for dynamic scenarios.
          </p>
          <TanStackExamples />
        </div>

        {/* Comparison Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-blue-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-blue-300">
              When to Use Manual Parallel
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Number of queries is fixed and known ahead of time</li>
              <li>
                Each query is logically different (users, posts, settings)
              </li>
              <li>Simple and readable code</li>
              <li>Great for fetching related but distinct data</li>
              <li>
                Example: Dashboard loading user + settings + notifications
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-purple-300">
              When to Use useQueries
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Number of queries changes dynamically</li>
              <li>Queries follow the same pattern with different IDs</li>
              <li>Generated from user input or dynamic lists</li>
              <li>Need to avoid violating rules of hooks</li>
              <li>
                Example: Fetching data for a dynamic list of selected items
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
