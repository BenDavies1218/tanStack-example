"use client";

import Link from "next/link";
import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { api } from "@/trpc/react";

export default function PaginatedQueriesPage() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    api.project.getPaginated.useQuery(
      { page, limit },
      {
        placeholderData: keepPreviousData,
      },
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-purple-300 hover:text-purple-100"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">Paginated Queries Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Smooth pagination with keepPreviousData to prevent UI jumps
        </p>

        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Projects</h2>
            {isFetching && !isPlaceholderData && (
              <span className="text-sm text-purple-300">Refreshing...</span>
            )}
            {isPlaceholderData && (
              <span className="text-sm text-yellow-300">Showing cached data...</span>
            )}
          </div>

          {isLoading && !data && (
            <div className="text-center text-lg text-gray-300">Loading projects...</div>
          )}

          {isError && (
            <div className="rounded-md bg-red-500/20 p-4 text-red-200">
              Error: {error.message}
            </div>
          )}

          {data && (
            <>
              <div className="mb-6 space-y-3">
                {data.projects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-md bg-white/5 p-4 transition-opacity ${
                      isPlaceholderData ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <div className="mt-2 flex items-center gap-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              project.status === "active"
                                ? "bg-green-500/20 text-green-300"
                                : project.status === "completed"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {project.status}
                          </span>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full bg-purple-500 transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-sm text-gray-400">
                  Page {page + 1} of {Math.ceil(data.total / limit)} • Showing {data.projects.length} of {data.total} projects
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                    disabled={page === 0}
                    className="rounded-md bg-white/10 px-4 py-2 font-semibold transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (!isPlaceholderData && data.hasMore) {
                        setPage((old) => old + 1);
                      }
                    }}
                    disabled={isPlaceholderData || !data.hasMore}
                    className="rounded-md bg-purple-500 px-4 py-2 font-semibold transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About Paginated Queries</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Without <code className="rounded bg-black/30 px-2 py-1">placeholderData</code>, UI
              jumps between success and pending states
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">keepPreviousData</code> keeps old
              data while fetching new data
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">isPlaceholderData</code> indicates
              when showing cached data
            </li>
            <li>Prevents disabling &ldquo;Next&rdquo; button until new data confirms more pages exist</li>
            <li>Creates a smoother, more professional pagination experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
