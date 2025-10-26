"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

// Mock API functions
const createTodo = async (todo: Omit<TodoItem, "id">): Promise<TodoItem> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate 10% failure rate
  if (Math.random() < 0.1) {
    throw new Error("Failed to create todo - server error");
  }

  return {
    id: Date.now().toString(),
    ...todo,
  };
};

const updateTodo = async (todo: TodoItem): Promise<TodoItem> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.1) {
    throw new Error("Failed to update todo - server error");
  }

  return todo;
};

const deleteTodo = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (Math.random() < 0.1) {
    throw new Error("Failed to delete todo - server error");
  }
};

const TanStackExamples = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [consecutiveCount, setConsecutiveCount] = useState(0);

  const queryClient = useQueryClient();

  // Example 1: Basic Mutation
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (data) => {
      console.log("Todo created:", data);
      setNewTodoTitle("");
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });

  // Example 2: Mutation with Retry
  const createWithRetry = useMutation({
    mutationFn: createTodo,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: () => {
      setNewTodoTitle("");
    },
  });

  // Example 3: mutateAsync for Promise-based Flow
  const updateMutation = useMutation({
    mutationFn: updateTodo,
  });

  const handleUpdateAsync = async () => {
    try {
      const result = await updateMutation.mutateAsync({
        id: "1",
        title: "Updated via mutateAsync",
        completed: true,
      });
      console.log("Update successful:", result);
      alert("Todo updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed!");
    } finally {
      console.log("Update operation completed");
    }
  };

  // Example 4: Mutation with Scope (Serial Execution)
  const serialMutation = useMutation({
    mutationFn: async (title: string) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { id: Date.now().toString(), title, completed: false };
    },
    scope: {
      id: "serial-todos",
    },
    onSuccess: () => {
      setConsecutiveCount((prev) => prev + 1);
    },
  });

  // Example 5: Mutation with Multiple Side Effects
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId) => {
      console.log(`[onMutate] About to delete todo: ${todoId}`);
      return { deletedAt: new Date().toISOString() };
    },
    onSuccess: (data, variables, context) => {
      console.log(`[onSuccess] Todo deleted at: ${context?.deletedAt}`);
    },
    onError: (error, variables, context) => {
      console.error(`[onError] Failed to delete. Context:`, context);
    },
    onSettled: (data, error, variables, context) => {
      console.log("[onSettled] Mutation completed (success or error)");
    },
  });

  const handleConsecutiveMutations = () => {
    setConsecutiveCount(0);
    // Trigger multiple mutations - they will run serially due to scope
    ["Todo 1", "Todo 2", "Todo 3"].forEach((title) => {
      serialMutation.mutate(title);
    });
  };

  return (
    <div className="space-y-8">
      {/* useMutation Options Reference */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold">
          useMutation with TanStack Query
        </h3>
        <p className="mb-4 text-sm text-gray-300">
          These examples show vanilla TanStack Query mutations without tRPC. Use
          these patterns when working with REST APIs, GraphQL, or any custom
          async functions.
        </p>

        <div className="rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Key Difference:</strong> Unlike tRPC mutations which are
            auto-generated, you define the{" "}
            <code className="rounded bg-black/30 px-1">mutationFn</code>{" "}
            manually for TanStack Query mutations.
          </p>
        </div>
      </div>

      {/* Example 1: Basic Mutation */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 1: Basic Mutation
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const mutation = useMutation({
  mutationFn: async (newTodo) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    });
    return response.json();
  },
  onSuccess: (data) => {
    console.log("Created:", data);
  },
  onError: (error) => {
    console.error("Failed:", error);
  },
});

// Trigger it
mutation.mutate({ title: "New Todo", completed: false });`}
          </pre>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Todo Title
            </label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Enter todo title..."
              className="w-full rounded bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() =>
              createMutation.mutate({
                title: newTodoTitle,
                completed: false,
              })
            }
            disabled={createMutation.isPending || !newTodoTitle}
            className="rounded bg-blue-600 px-6 py-2 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Todo"}
          </button>

          {createMutation.isError && (
            <div className="rounded bg-red-900/50 p-3 text-red-200">
              Error: {createMutation.error.message}
            </div>
          )}

          {createMutation.isSuccess && (
            <div className="rounded bg-green-900/50 p-3 text-green-200">
              ✓ Todo created: {createMutation.data.title} (ID:{" "}
              {createMutation.data.id})
            </div>
          )}
        </div>

        <div className="mt-4 rounded bg-green-900/20 p-3">
          <p className="text-xs text-green-200">
            <strong>💡 Basic Pattern:</strong> Define{" "}
            <code className="rounded bg-black/30 px-1">mutationFn</code> with
            your async logic, then call{" "}
            <code className="rounded bg-black/30 px-1">mutate(variables)</code>{" "}
            to execute. Has a 10% random failure rate to demonstrate error
            handling.
          </p>
        </div>
      </div>

      {/* Example 2: Mutation with Retry */}
      <div className="rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-900/30 to-blue-900/30 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-cyan-100">
          Example 2: Mutation with Retry Logic
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const mutation = useMutation({
  mutationFn: createTodo,
  retry: 3, // Retry up to 3 times on failure
  retryDelay: (attemptIndex) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
  // Exponential backoff: 1s, 2s, 4s, 8s...
});`}
          </pre>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Todo Title (with Retry)
            </label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Enter todo title..."
              className="w-full rounded bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() =>
              createWithRetry.mutate({
                title: newTodoTitle,
                completed: false,
              })
            }
            disabled={createWithRetry.isPending || !newTodoTitle}
            className="rounded bg-cyan-600 px-6 py-2 font-semibold hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createWithRetry.isPending
              ? "Creating (will retry on failure)..."
              : "Create with Retry"}
          </button>

          {createWithRetry.isError && (
            <div className="rounded bg-red-900/50 p-3 text-red-200">
              Error after retries: {createWithRetry.error.message}
              <br />
              <span className="text-xs">
                (Tried up to 3 times with exponential backoff)
              </span>
            </div>
          )}

          {createWithRetry.isSuccess && (
            <div className="rounded bg-green-900/50 p-3 text-green-200">
              ✓ Todo created: {createWithRetry.data.title}
            </div>
          )}
        </div>

        <div className="mt-4 rounded border border-cyan-500/20 bg-cyan-900/20 p-4">
          <p className="mb-2 text-xs text-cyan-200">
            <strong>🔄 Retry Strategy:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-cyan-200/80">
            <li>
              Unlike queries (default retry: 3), mutations default to{" "}
              <strong>no retries</strong>
            </li>
            <li>
              Set <code className="rounded bg-black/30 px-1">retry: 3</code> to
              enable retry logic
            </li>
            <li>
              Use <code className="rounded bg-black/30 px-1">retryDelay</code>{" "}
              for exponential backoff
            </li>
            <li>Great for network-sensitive operations</li>
          </ul>
        </div>
      </div>

      {/* Example 3: mutateAsync */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 3: mutateAsync for Promise-based Workflows
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const mutation = useMutation({ mutationFn: updateTodo });

// Use with async/await
const handleUpdate = async () => {
  try {
    const result = await mutation.mutateAsync({
      id: "1",
      title: "Updated",
      completed: true,
    });
    console.log("Success:", result);
    // Continue with other logic...
  } catch (error) {
    console.error("Failed:", error);
  } finally {
    console.log("Operation complete");
  }
};`}
          </pre>
        </div>

        <button
          onClick={handleUpdateAsync}
          disabled={updateMutation.isPending}
          className="rounded bg-purple-600 px-6 py-2 font-semibold hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateMutation.isPending
            ? "Updating..."
            : "Update Todo (mutateAsync)"}
        </button>

        {updateMutation.isError && (
          <div className="mt-4 rounded bg-red-900/50 p-3 text-red-200">
            Error: {updateMutation.error.message}
          </div>
        )}

        {updateMutation.isSuccess && (
          <div className="mt-4 rounded bg-green-900/50 p-3 text-green-200">
            ✓ Todo updated: {updateMutation.data.title}
          </div>
        )}

        <div className="mt-4 rounded bg-purple-900/20 p-3">
          <p className="mb-2 text-xs text-purple-200">
            <strong>🎯 mutateAsync vs mutate:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-purple-200/80">
            <li>
              <code className="rounded bg-black/30 px-1">mutate()</code> - Fire
              and forget, use callbacks
            </li>
            <li>
              <code className="rounded bg-black/30 px-1">mutateAsync()</code> -
              Returns promise, use try/catch
            </li>
            <li>
              <code className="rounded bg-black/30 px-1">mutateAsync</code> is
              perfect for sequential operations
            </li>
            <li>Allows composing side effects with async/await</li>
          </ul>
        </div>
      </div>

      {/* Example 4: Mutation Scope (Serial Execution) */}
      <div className="rounded-lg border border-orange-500/20 bg-linear-to-br from-orange-900/30 to-red-900/30 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-orange-100">
          Example 4: Mutation Scope (Serial Execution)
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const mutation = useMutation({
  mutationFn: createTodo,
  scope: {
    id: "serial-todos",
  },
});

// These run serially, not in parallel
mutation.mutate({ title: "Todo 1" });
mutation.mutate({ title: "Todo 2" });
mutation.mutate({ title: "Todo 3" });
// Executes: Todo 1 -> wait -> Todo 2 -> wait -> Todo 3`}
          </pre>
        </div>

        <button
          onClick={handleConsecutiveMutations}
          disabled={serialMutation.isPending}
          className="rounded bg-orange-600 px-6 py-2 font-semibold hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {serialMutation.isPending
            ? `Processing ${consecutiveCount}/3...`
            : "Create 3 Todos Serially"}
        </button>

        {consecutiveCount > 0 && (
          <div className="mt-4 rounded bg-orange-900/50 p-3 text-orange-200">
            Completed: {consecutiveCount}/3 todos
          </div>
        )}

        <div className="mt-4 rounded border border-orange-500/20 bg-orange-900/20 p-4">
          <p className="mb-2 text-xs text-orange-200">
            <strong>📋 Mutation Scope:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-orange-200/80">
            <li>
              By default, multiple{" "}
              <code className="rounded bg-black/30 px-1">mutate()</code> calls
              run in parallel
            </li>
            <li>
              Add <code className="rounded bg-black/30 px-1">scope.id</code> to
              run them serially
            </li>
            <li>
              Mutations with same scope ID form a queue and execute one by one
            </li>
            <li>
              Useful for operations that must complete in order (e.g., file
              uploads)
            </li>
          </ul>
        </div>
      </div>

      {/* Example 5: Mutation Lifecycle Callbacks */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Example 5: Mutation Lifecycle Callbacks
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const mutation = useMutation({
  mutationFn: deleteTodo,
  onMutate: (variables) => {
    console.log("About to delete:", variables);
    return { timestamp: Date.now() }; // Context
  },
  onSuccess: (data, variables, context) => {
    console.log("Deleted! Context:", context);
  },
  onError: (error, variables, context) => {
    console.error("Failed! Context:", context);
  },
  onSettled: (data, error, variables, context) => {
    console.log("Completed (success or error)");
  },
});`}
          </pre>
        </div>

        <button
          onClick={() => deleteMutation.mutate(Date.now().toString())}
          disabled={deleteMutation.isPending}
          className="rounded bg-red-600 px-6 py-2 font-semibold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteMutation.isPending
            ? "Deleting..."
            : "Delete Todo (w/ Lifecycle)"}
        </button>

        <div className="mt-4 rounded bg-gray-900/50 p-3 font-mono text-xs text-gray-300">
          <div className="mb-1 text-gray-400">Console Output:</div>
          Check your browser console to see the lifecycle callbacks in action:
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>onMutate - Before mutation starts</li>
            <li>onSuccess OR onError - After completion</li>
            <li>onSettled - Always runs last</li>
          </ul>
        </div>

        <div className="mt-4 rounded bg-blue-900/20 p-3">
          <p className="mb-2 text-xs text-blue-200">
            <strong>🔄 Callback Order:</strong>
          </p>
          <ol className="list-inside list-decimal space-y-1 text-xs text-blue-200/80">
            <li>
              <strong>onMutate</strong> - Runs first, can return context object
            </li>
            <li>
              <strong>mutationFn</strong> - Your async function executes
            </li>
            <li>
              <strong>onSuccess</strong> OR <strong>onError</strong> - Based on
              result
            </li>
            <li>
              <strong>onSettled</strong> - Always runs last, good for cleanup
            </li>
            <li>All callbacks receive the context from onMutate</li>
          </ol>
        </div>
      </div>

      {/* Best Practices */}
      <div className="rounded-lg bg-green-900/20 p-6">
        <h4 className="mb-3 font-semibold text-green-200">
          Mutation Best Practices:
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Query Invalidation
            </h5>
            <p className="text-xs text-gray-400">
              After mutations, invalidate related queries to refetch fresh data
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Optimistic Updates
            </h5>
            <p className="text-xs text-gray-400">
              Update UI immediately in onMutate, rollback in onError if needed
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Error Handling
            </h5>
            <p className="text-xs text-gray-400">
              Always provide onError callback and show user-friendly error
              messages
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Loading States
            </h5>
            <p className="text-xs text-gray-400">
              Use isPending to disable buttons and show loading indicators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanStackExamples;
