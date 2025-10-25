import Link from "next/link";

export default function UseInfiniteQueryPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">useInfiniteQuery Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Infinite scrolling and cursor-based pagination
        </p>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useInfiniteQuery</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Perfect for infinite scrolling and &ldquo;load more&rdquo;
              patterns
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
      </div>
    </div>
  );
}
