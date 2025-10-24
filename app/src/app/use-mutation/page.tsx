"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function UseMutationPage() {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const utils = api.useUtils();

  // Query for todos
  const { data: todos } = api.todo.getAll.useQuery();

  // Create mutation
  const createMutation = api.todo.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch todos after creation
      void utils.todo.getAll.invalidate();
      setNewTodoTitle("");
    },
  });

  // Update mutation
  const updateMutation = api.todo.update.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  // Delete mutation
  const deleteMutation = api.todo.delete.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    createMutation.mutate({ title: newTodoTitle });
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateMutation.mutate({ id, completed: !completed });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
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

        <h1 className="mb-4 text-4xl font-bold">useMutation Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Create, update, and delete data with mutations
        </p>

        {/* Create Todo Form */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Create New Todo</h2>
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Enter todo title..."
              className="flex-1 rounded-md bg-white/10 px-4 py-2 text-white placeholder-gray-400 outline-none focus:bg-white/20"
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !newTodoTitle.trim()}
              className="rounded-md bg-purple-500 px-6 py-2 font-semibold transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? "Adding..." : "Add Todo"}
            </button>
          </form>

          {createMutation.isError && (
            <div className="mt-3 rounded-md bg-red-500/20 p-3 text-red-200">
              Error: {createMutation.error.message}
            </div>
          )}

          {createMutation.isSuccess && (
            <div className="mt-3 rounded-md bg-green-500/20 p-3 text-green-200">
              Todo added successfully!
            </div>
          )}
        </div>

        {/* Todos List */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Todos</h2>

          {!todos ? (
            <div className="text-center text-gray-300">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-gray-400">No todos yet. Create one above!</div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-md bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleComplete(todo.id, todo.completed)}
                      disabled={updateMutation.isPending}
                      className="h-5 w-5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        readOnly
                        className="h-5 w-5 cursor-pointer"
                      />
                    </button>
                    <div>
                      <p
                        className={`text-lg ${todo.completed ? "line-through opacity-60" : ""}`}
                      >
                        {todo.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-md bg-red-500/20 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/30 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">About useMutation</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>Used for create/update/delete operations and server side-effects</li>
            <li>Provides isPending, isError, isSuccess states</li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">onSuccess</code>,{" "}
              <code className="rounded bg-black/30 px-2 py-1">onError</code>, and{" "}
              <code className="rounded bg-black/30 px-2 py-1">onSettled</code> callbacks for
              side-effects
            </li>
            <li>Combine with invalidateQueries to refetch data after mutations</li>
            <li>
              Use <code className="rounded bg-black/30 px-2 py-1">mutateAsync</code> for
              promise-based workflows
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
