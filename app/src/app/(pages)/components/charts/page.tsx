"use client";

import Link from "next/link";
import InfiniteTableExample from "@/app/_components/table-examples/infinite-table-example";
import InfiniteTableEtherscan from "@/app/_components/table-examples/infinite-table-etherscan";

export default function InfiniteTablePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-7xl p-6">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">Infinite Scrolling Table</h1>
        <p className="mb-8 text-lg text-gray-300">
          Generic table component combined with useInfiniteQuery for automatic
          data loading
        </p>

        <div className="mb-8 rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">
            About Infinite Scrolling Tables
          </h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Combines the generic table structure with{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                useInfiniteQuery
              </code>
            </li>
            <li>
              Uses Intersection Observer in the table footer to trigger
              auto-loading
            </li>
            <li>
              All fetched pages are flattened into a single array for table
              rendering
            </li>
            <li>
              Supports filtering and search with automatic query invalidation
            </li>
            <li>Works with both MongoDB and PostgreSQL backends</li>
            <li>
              Shows loading states, pagination info, and handles empty states
            </li>
          </ul>
        </div>

        {/* Example */}
        <div className="flex flex-col gap-6 rounded-lg bg-white/5 p-6">
          <h2 className="mb-6 text-3xl font-bold">
            Infinite Scrolling Table Example
          </h2>
          <p className="mb-6 text-gray-300">
            This example demonstrates how to use the generic table components
            with infinite query patterns. Scroll down in the table to
            automatically load more data, or use the &ldquo;Load More&rdquo;
            button for manual control.
          </p>
          <div className="space-y-24">
            <InfiniteTableExample />

            <InfiniteTableEtherscan />
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-cyan-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-cyan-300">
              When to Use This Pattern
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Long lists of data that would be slow to load all at once</li>
              <li>Social media feeds, activity logs, transaction histories</li>
              <li>When you want better UX than traditional pagination</li>
              <li>Mobile-friendly scrolling experiences</li>
              <li>Real-time or frequently updating data</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-purple-300">
              Benefits Over Standard Pagination
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>No need to click &ldquo;Next Page&rdquo; buttons</li>
              <li>Keeps all previously loaded data visible</li>
              <li>Natural scrolling experience</li>
              <li>Better for mobile and touch devices</li>
              <li>Can combine with search/filter seamlessly</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 rounded-lg bg-linear-to-r from-green-900/20 to-blue-900/20 p-6">
          <h3 className="mb-4 text-xl font-semibold">Technical Details:</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-green-300">
                Data Flow
              </h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-400">
                <li>useInfiniteQuery fetches pages of data</li>
                <li>pages.flatMap() combines all pages into one array</li>
                <li>GenericTable renders all items</li>
                <li>IntersectionObserver triggers fetchNextPage()</li>
                <li>New data is appended to the table</li>
              </ol>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-cyan-300">
                Key Components Used
              </h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>
                  <code className="text-cyan-200">GenericTable</code> - Table
                  structure
                </li>
                <li>
                  <code className="text-cyan-200">useInfiniteQuery</code> - Data
                  fetching
                </li>
                <li>
                  <code className="text-cyan-200">IntersectionObserver</code> -
                  Auto-loading
                </li>
                <li>
                  <code className="text-cyan-200">TableFooter</code> -
                  Loading/observer placement
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Pattern */}
        <div className="mt-8 rounded-lg bg-black/30 p-6">
          <h3 className="mb-4 text-xl font-semibold text-yellow-300">
            Basic Pattern:
          </h3>
          <pre className="overflow-x-auto text-sm text-gray-300">
            {`const query = api.infinite.getData.useInfiniteQuery(
  { limit: 10 },
  { getNextPageParam: (lastPage) => lastPage.nextCursor }
);

const allItems = query.data?.pages.flatMap(page => page.items) ?? [];

<GenericTable columns={columns} data={allItems}>
  <TableFooter>
    {query.hasNextPage && (
      <IntersectionObserver onIntersect={() => query.fetchNextPage()}>
        <div>Loading more...</div>
      </IntersectionObserver>
    )}
  </TableFooter>
</GenericTable>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
