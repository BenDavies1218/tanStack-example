"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IntersectionObserver } from "@/app/_components/shared/IntersectionObserver";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Mock API function for infinite scroll
const fetchPosts = async ({
  pageParam = 0,
}): Promise<{ posts: Post[]; nextCursor?: number }> => {
  const limit = 10;
  const start = pageParam * limit;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Fetch from JSONPlaceholder API (100 posts total)
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = (await response.json()) as Post[];

  // Calculate next cursor (null if no more data)
  const nextCursor = posts.length === limit ? pageParam + 1 : undefined;

  return { posts, nextCursor };
};

const TanStackExamples = () => {
  const [enabled, setEnabled] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts-infinite"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled,
  });

  // Flatten all pages into a single array
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold">
          TanStack Query - useInfiniteQuery
        </h3>
        <p className="mb-4 text-sm text-gray-300">
          This example uses vanilla TanStack Query with JSONPlaceholder API to
          demonstrate infinite scrolling without tRPC.
        </p>

        <div className="rounded bg-blue-900/30 p-4">
          <p className="text-xs text-blue-200">
            <strong>💡 Key Difference:</strong> With TanStack Query, you
            manually define the{" "}
            <code className="rounded bg-black/30 px-1">queryFn</code> and handle
            the <code className="rounded bg-black/30 px-1">pageParam</code>{" "}
            yourself. Works with any REST API, GraphQL endpoint, or custom data
            source.
          </p>
        </div>
      </div>

      {/* Code Example */}
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Basic useInfiniteQuery Pattern
        </h3>

        <div className="mb-4 rounded bg-black/30 p-4 font-mono text-sm">
          <pre className="overflow-x-auto">
            {`const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["posts-infinite"],
  queryFn: async ({ pageParam = 0 }) => {
    const response = await fetch(
      \`/api/posts?page=\${pageParam}&limit=10\`
    );
    const posts = await response.json();

    return {
      posts,
      nextCursor: posts.length === 10 ? pageParam + 1 : undefined,
    };
  },
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  initialPageParam: 0,
});

// Flatten pages
const allPosts = data?.pages.flatMap(page => page.posts);

// Load more
if (hasNextPage) {
  fetchNextPage();
}`}
          </pre>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`rounded px-4 py-2 text-sm ${
              enabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {enabled ? "Enabled ✓" : "Disabled"}
          </button>
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isFetching ? "Refetching..." : "Refetch"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-900/30 to-blue-900/30 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-cyan-100">
            Posts ({allPosts.length} loaded)
          </h3>
          <div className="flex items-center gap-3">
            {isFetching && !isFetchingNextPage && (
              <span className="text-sm text-yellow-400">Refetching...</span>
            )}
            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-700 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="py-8 text-center text-yellow-400">
            Loading initial data...
          </div>
        )}

        {isError && (
          <div className="rounded bg-red-900/50 p-4 text-red-200">
            Error: {error.message}
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-3">
          {allPosts.map((post, index) => (
            <div
              key={`${post.id}-${index}`}
              className="rounded border border-cyan-500/30 bg-white/5 p-4"
            >
              <h4 className="mb-2 font-semibold text-cyan-200">
                {post.id}. {post.title}
              </h4>
              <p className="text-sm text-gray-400">{post.body}</p>
              <div className="mt-2 text-xs text-gray-500">
                User ID: {post.userId}
              </div>
            </div>
          ))}
        </div>

        {/* Intersection Observer for Auto-loading */}
        {hasNextPage && !isFetchingNextPage && enabled && (
          <IntersectionObserver
            onIntersect={handleLoadMore}
            enabled={!isFetchingNextPage}
            rootMargin="200px"
            className="mt-4 py-4 text-center"
          >
            <div className="rounded bg-cyan-900/30 p-4 text-cyan-200">
              <div className="text-sm">Scroll down to load more...</div>
            </div>
          </IntersectionObserver>
        )}

        {/* Loading Next Page */}
        {isFetchingNextPage && (
          <div className="mt-4 py-4 text-center text-yellow-400">
            Loading more posts...
          </div>
        )}

        {/* No More Data */}
        {!hasNextPage && allPosts.length > 0 && (
          <div className="mt-4 rounded bg-gray-900/50 p-4 text-center text-gray-400">
            No more posts to load (100 total)
          </div>
        )}
      </div>

      {/* Pagination Strategies */}
      <div className="rounded-lg bg-orange-900/20 p-6">
        <h4 className="mb-3 font-semibold text-orange-200">
          Pagination Strategies:
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded bg-white/5 p-4">
            <h5 className="mb-2 font-semibold text-orange-300">
              Offset-based (used here)
            </h5>
            <div className="space-y-2 text-xs text-gray-400">
              <p>
                <strong>Cursor:</strong> Page number or offset
              </p>
              <p>
                <strong>Next:</strong> pageParam + 1
              </p>
              <p>
                <strong>Pros:</strong> Simple, works with any API
              </p>
              <p>
                <strong>Cons:</strong> Can have duplicates if data changes
              </p>
              <div className="mt-2 rounded bg-black/30 p-2 font-mono">
                ?page=0&limit=10
              </div>
            </div>
          </div>

          <div className="rounded bg-white/5 p-4">
            <h5 className="mb-2 font-semibold text-orange-300">Cursor-based</h5>
            <div className="space-y-2 text-xs text-gray-400">
              <p>
                <strong>Cursor:</strong> ID or timestamp of last item
              </p>
              <p>
                <strong>Next:</strong> lastItem.id
              </p>
              <p>
                <strong>Pros:</strong> No duplicates, performant
              </p>
              <p>
                <strong>Cons:</strong> Requires API support
              </p>
              <div className="mt-2 rounded bg-black/30 p-2 font-mono">
                ?cursor=abc123&limit=10
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="rounded-lg bg-green-900/20 p-6">
        <h4 className="mb-3 font-semibold text-green-200">
          useInfiniteQuery Best Practices:
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Use Intersection Observer
            </h5>
            <p className="text-xs text-gray-400">
              Automatically load more when user scrolls near bottom. Better UX
              than &quot;Load More&quot; button.
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Flatten Pages
            </h5>
            <p className="text-xs text-gray-400">
              Use pages.flatMap() to combine all pages into a single array for
              easier rendering.
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Set initialPageParam
            </h5>
            <p className="text-xs text-gray-400">
              Always set initialPageParam (e.g., 0 or undefined) to define the
              starting point.
            </p>
          </div>

          <div className="rounded bg-white/5 p-3">
            <h5 className="mb-1 text-sm font-semibold text-green-300">
              Handle Edge Cases
            </h5>
            <p className="text-xs text-gray-400">
              Check hasNextPage before fetching, show loading states, handle
              errors gracefully.
            </p>
          </div>
        </div>
      </div>

      {/* Key Properties */}
      <div className="rounded-lg bg-purple-900/20 p-6">
        <h4 className="mb-3 font-semibold text-purple-200">
          useInfiniteQuery Return Properties:
        </h4>
        <div className="grid gap-2 md:grid-cols-3">
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">data.pages</code> - Array of page
            results
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">data.pageParams</code> - Array of
            page params used
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">fetchNextPage()</code> - Load next
            page
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">fetchPreviousPage()</code> - Load
            previous page
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">hasNextPage</code> - boolean, more
            pages available
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">hasPreviousPage</code> - boolean,
            previous pages exist
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">isFetchingNextPage</code> -
            boolean, fetching next
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">isFetchingPreviousPage</code> -
            boolean, fetching previous
          </div>
          <div className="rounded bg-white/5 p-2 text-xs">
            <code className="text-purple-300">...all useQuery props</code> -
            isLoading, error, etc.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanStackExamples;
