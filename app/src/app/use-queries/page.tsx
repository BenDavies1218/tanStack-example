"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function UseQueriesPage() {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([1, 2, 3]);

  // First, get all users to display the selection
  const { data: allUsers } = api.user.getAll.useQuery();

  // Use multiple useQuery calls in parallel (Manual Parallel Queries)
  const user1Query = api.user.getById.useQuery(
    { id: 1 },
    { enabled: selectedUserIds.includes(1) },
  );
  const user2Query = api.user.getById.useQuery(
    { id: 2 },
    { enabled: selectedUserIds.includes(2) },
  );
  const user3Query = api.user.getById.useQuery(
    { id: 3 },
    { enabled: selectedUserIds.includes(3) },
  );

  const manualQueries = [user1Query, user2Query, user3Query];
  const isLoadingManual = manualQueries.some((q) => q.isLoading);

  const toggleUserId = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-purple-300 hover:text-purple-100"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">useQueries & Parallel Queries</h1>
        <p className="mb-8 text-lg text-gray-300">
          Executing multiple queries in parallel with different approaches
        </p>

        {/* User Selection */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Select Users to Fetch</h2>
          <div className="flex flex-wrap gap-3">
            {allUsers?.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserId(user.id)}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  selectedUserIds.includes(user.id)
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Parallel Queries */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Manual Parallel Queries</h2>
          <p className="mb-4 text-sm text-gray-300">
            Using multiple useQuery hooks side-by-side (fixed number of queries)
          </p>

          {isLoadingManual && (
            <div className="text-center text-lg text-gray-300">Loading users...</div>
          )}

          <div className="space-y-3">
            {manualQueries.map((query, index) => {
              const userId = index + 1;
              if (!selectedUserIds.includes(userId)) return null;

              return (
                <div key={userId} className="rounded-md bg-white/5 p-4">
                  {query.isLoading && <p className="text-gray-400">Loading user {userId}...</p>}
                  {query.isError && (
                    <p className="text-red-300">Error loading user {userId}</p>
                  )}
                  {query.data && (
                    <div>
                      <h3 className="text-lg font-semibold">{query.data.name}</h3>
                      <p className="text-sm text-gray-400">{query.data.email}</p>
                      <span className="mt-2 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                        {query.data.role}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About Parallel Queries</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              <strong>Manual Parallel:</strong> Use multiple useQuery hooks when the number of
              queries is fixed
            </li>
            <li>
              <strong>useQueries:</strong> Use when the number of queries changes dynamically
            </li>
            <li>All queries execute in parallel to maximize fetching concurrency</li>
            <li>Each query maintains its own loading and error state</li>
            <li>
              <strong>Note:</strong> In Suspense mode, use useSuspenseQueries instead
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
