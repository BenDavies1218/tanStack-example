"use client";

import Link from "next/link";

export default function UseQueryPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">useQuery Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Basic query fetching with loading and error states
        </p>

        <div className="rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">All Todos</h2>
        </div>

        <div className="mt-8 rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useQuery</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>Automatically fetches data when component mounts</li>
            <li>Provides loading, error, and success states</li>
            <li>Automatically caches data and manages refetching</li>
            <li>Returns stale data while refetching in background</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
