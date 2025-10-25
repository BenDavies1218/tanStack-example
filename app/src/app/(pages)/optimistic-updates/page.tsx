import Link from "next/link";

export default function OptimisticUpdatesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">Optimistic Updates Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Update UI before server confirms changes for instant feedback
        </p>

        <div className="mb-6 rounded-lg bg-blue-500/10 p-6">
          <h3 className="mb-2 font-semibold text-blue-300">How it works:</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-300">
            <li>
              <strong>onMutate:</strong> Cancel queries, snapshot data, update
              cache optimistically
            </li>
            <li>
              <strong>onError:</strong> Rollback to snapshot if mutation fails
            </li>
            <li>
              <strong>onSettled:</strong> Refetch to sync with server state
            </li>
          </ol>
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">
            When to use each approach
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-1 font-semibold text-purple-300">
                Via UI (Simpler)
              </h4>
              <ul className="list-inside list-disc text-sm text-gray-300">
                <li>Single location needs to show optimistic state</li>
                <li>Less code, easier to reason about</li>
                <li>No rollback handling needed</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-purple-300">
                Via Cache (More Powerful)
              </h4>
              <ul className="list-inside list-disc text-sm text-gray-300">
                <li>Multiple components need to see the update</li>
                <li>Automatic propagation across all query consumers</li>
                <li>Supports rollback on error</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
