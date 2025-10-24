"use client";

import Link from "next/link";
import { api } from "@/trpc/react";

export default function UseQueryPage() {
  // Basic useQuery example
  const { data: todos, isLoading, isError, error } = api.todo.getAll.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-purple-300 hover:text-purple-100"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">useQuery Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Basic query fetching with loading and error states
        </p>

        <div className="rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">All Todos</h2>

          {isLoading && (
            <div className="text-center text-lg text-gray-300">Loading todos...</div>
          )}

          {isError && (
            <div className="rounded-md bg-red-500/20 p-4 text-red-200">
              Error: {error.message}
            </div>
          )}

          {todos && (
            <div className="space-y-3">
              {todos.map((todo) => (
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
                      <p className="text-sm text-gray-400">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
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
          )}
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
