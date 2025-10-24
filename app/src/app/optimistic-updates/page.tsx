"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function OptimisticUpdatesPage() {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const utils = api.useUtils();

  // Query for todos
  const { data: todos } = api.todo.getAll.useQuery();

  // Mutation with optimistic update via cache
  const createMutationCache = api.todo.create.useMutation({
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await utils.todo.getAll.cancel();

      // Snapshot the previous value
      const previousTodos = utils.todo.getAll.getData();

      // Optimistically update to the new value
      utils.todo.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return [
          ...old,
          {
            id: Date.now(),
            title: newTodo.title,
            completed: false,
            createdAt: new Date(),
          },
        ];
      });

      // Return context with the snapshot
      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        utils.todo.getAll.setData(undefined, context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      void utils.todo.getAll.invalidate();
    },
  });

  // Mutation with optimistic update via UI
  const createMutationUI = api.todo.create.useMutation({
    onSettled: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  // Update mutation for toggling completion
  const updateMutation = api.todo.update.useMutation({
    onMutate: async (updatedTodo) => {
      await utils.todo.getAll.cancel();
      const previousTodos = utils.todo.getAll.getData();

      utils.todo.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((todo) =>
          todo.id === updatedTodo.id
            ? { ...todo, completed: updatedTodo.completed ?? todo.completed }
            : todo,
        );
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        utils.todo.getAll.setData(undefined, context.previousTodos);
      }
    },
    onSettled: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const [activeTab, setActiveTab] = useState<"cache" | "ui">("cache");

  const handleCreateCache = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    createMutationCache.mutate({ title: newTodoTitle });
    setNewTodoTitle("");
  };

  const handleCreateUI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    createMutationUI.mutate({ title: newTodoTitle });
    setNewTodoTitle("");
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateMutation.mutate({ id, completed: !completed });
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

        <h1 className="mb-4 text-4xl font-bold">Optimistic Updates Example</h1>
        <p className="mb-8 text-lg text-gray-300">
          Update UI before server confirms changes for instant feedback
        </p>

        {/* Tab Selector */}
        <div className="mb-6 flex gap-2 rounded-lg bg-white/10 p-2">
          <button
            onClick={() => setActiveTab("cache")}
            className={`flex-1 rounded-md px-4 py-2 font-semibold transition-colors ${
              activeTab === "cache"
                ? "bg-purple-500 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            Via Cache
          </button>
          <button
            onClick={() => setActiveTab("ui")}
            className={`flex-1 rounded-md px-4 py-2 font-semibold transition-colors ${
              activeTab === "ui" ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            Via UI
          </button>
        </div>

        {/* Cache Approach */}
        {activeTab === "cache" && (
          <>
            <div className="mb-6 rounded-lg bg-white/10 p-6">
              <h2 className="mb-2 text-2xl font-semibold">Optimistic Updates via Cache</h2>
              <p className="mb-4 text-sm text-gray-300">
                Updates cache directly using onMutate, with automatic rollback on error
              </p>
              <form onSubmit={handleCreateCache} className="flex gap-3">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Enter todo title..."
                  className="flex-1 rounded-md bg-white/10 px-4 py-2 text-white placeholder-gray-400 outline-none focus:bg-white/20"
                />
                <button
                  type="submit"
                  disabled={!newTodoTitle.trim()}
                  className="rounded-md bg-purple-500 px-6 py-2 font-semibold transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Todo
                </button>
              </form>
            </div>

            <div className="mb-6 rounded-lg bg-blue-500/10 p-6">
              <h3 className="mb-2 font-semibold text-blue-300">How it works:</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-300">
                <li>
                  <strong>onMutate:</strong> Cancel queries, snapshot data, update cache optimistically
                </li>
                <li>
                  <strong>onError:</strong> Rollback to snapshot if mutation fails
                </li>
                <li>
                  <strong>onSettled:</strong> Refetch to sync with server state
                </li>
              </ol>
            </div>
          </>
        )}

        {/* UI Approach */}
        {activeTab === "ui" && (
          <>
            <div className="mb-6 rounded-lg bg-white/10 p-6">
              <h2 className="mb-2 text-2xl font-semibold">Optimistic Updates via UI</h2>
              <p className="mb-4 text-sm text-gray-300">
                Shows pending state in UI using mutation.variables and mutation.isPending
              </p>
              <form onSubmit={handleCreateUI} className="flex gap-3">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Enter todo title..."
                  className="flex-1 rounded-md bg-white/10 px-4 py-2 text-white placeholder-gray-400 outline-none focus:bg-white/20"
                />
                <button
                  type="submit"
                  disabled={!newTodoTitle.trim()}
                  className="rounded-md bg-purple-500 px-6 py-2 font-semibold transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Todo
                </button>
              </form>
            </div>

            <div className="mb-6 rounded-lg bg-green-500/10 p-6">
              <h3 className="mb-2 font-semibold text-green-300">How it works:</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-300">
                <li>Render pending item directly in UI using mutation.variables</li>
                <li>Show with reduced opacity while mutation.isPending is true</li>
                <li>Automatically disappears when mutation completes</li>
                <li>Simpler approach - no cache manipulation needed</li>
              </ol>
            </div>
          </>
        )}

        {/* Todos List */}
        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Todos (Try toggling completion!)</h2>

          {!todos ? (
            <div className="text-center text-gray-300">Loading todos...</div>
          ) : (
            <div className="space-y-3">
              {/* Show pending todo for UI approach */}
              {activeTab === "ui" && createMutationUI.isPending && createMutationUI.variables && (
                <div className="rounded-md bg-white/5 p-4 opacity-50">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={false} readOnly className="h-5 w-5" />
                    <div>
                      <p className="text-lg">{createMutationUI.variables.title}</p>
                      <p className="text-xs text-yellow-300">Adding...</p>
                    </div>
                  </div>
                </div>
              )}

              {todos.map((todo) => (
                <div key={todo.id} className="rounded-md bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleComplete(todo.id, todo.completed)}
                      className="h-5 w-5"
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">When to use each approach</h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-1 font-semibold text-purple-300">Via UI (Simpler)</h4>
              <ul className="list-inside list-disc text-sm text-gray-300">
                <li>Single location needs to show optimistic state</li>
                <li>Less code, easier to reason about</li>
                <li>No rollback handling needed</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-purple-300">Via Cache (More Powerful)</h4>
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
