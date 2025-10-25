import Link from "next/link";

export default function PaginatedQueriesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">Paginated Queries Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Smooth pagination with keepPreviousData to prevent UI jumps
        </p>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">
            About Paginated Queries
          </h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Without{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                placeholderData
              </code>
              , UI jumps between success and pending states
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">
                keepPreviousData
              </code>{" "}
              keeps old data while fetching new data
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">
                isPlaceholderData
              </code>{" "}
              indicates when showing cached data
            </li>
            <li>
              Prevents disabling &ldquo;Next&rdquo; button until new data
              confirms more pages exist
            </li>
            <li>Creates a smoother, more professional pagination experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
