"use client";

import Link from "next/link";
import { api } from "@/trpc/react";

export default function UseInfiniteQueryPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = api.todo.getInfinite.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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

        <h1 className="mb-4 text-4xl font-bold">useInfiniteQuery Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Infinite scrolling and cursor-based pagination
        </p>

        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Infinite Todos List</h2>

          {isLoading && (
            <div className="text-center text-lg text-gray-300">
              Loading todos...
            </div>
          )}

          {isError && (
            <div className="rounded-md bg-red-500/20 p-4 text-red-200">
              Error: {error.message}
            </div>
          )}

          {data && (
            <div className="space-y-6">
              {data.pages.map((page, pageIndex) => (
                <div key={pageIndex} className="space-y-3">
                  <div className="text-sm font-semibold text-purple-300">
                    Page {pageIndex + 1}
                  </div>
                  {page.items.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between rounded-md bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          readOnly
                          className="h-5 w-5"
                        />
                        <div>
                          <p
                            className={`text-lg ${todo.completed ? "line-through opacity-60" : ""}`}
                          >
                            {todo.title}
                          </p>
                          <p className="text-sm text-gray-400">ID: {todo.id}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          todo.completed
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="mt-6 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="rounded-md bg-purple-500 px-8 py-3 font-semibold transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                      ? "Load More"
                      : "No more todos"}
                </button>
              </div>

              <div className="text-center text-sm text-gray-400">
                Loaded{" "}
                {data.pages.reduce((acc, page) => acc + page.items.length, 0)}{" "}
                todos across {data.pages.length} page(s)
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useInfiniteQuery</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>Perfect for infinite scrolling and "load more" patterns</li>
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
