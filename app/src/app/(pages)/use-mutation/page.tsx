import Link from "next/link";

export default function UseMutationPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">useMutation Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Create, update, and delete data with mutations
        </p>

        <div className="rounded-lg bg-white/5 p-6">
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
      </div>
    </div>
  );
}
