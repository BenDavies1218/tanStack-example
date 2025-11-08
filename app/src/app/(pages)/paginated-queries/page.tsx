import PageContainer from "@/app/_components/pageContainer";

export default function PaginatedQueriesPage() {
  return (
    <PageContainer
      title="Paginated Queries Example"
      description="Smooth pagination with keepPreviousData to prevent UI jumps"
      className="max-w-4xl"
    >
      <div className="rounded-lg bg-white/5 p-6">
        <h3 className="mb-3 text-xl font-semibold">
          About Paginated Queries
        </h3>
        <ul className="list-inside list-disc space-y-2 text-gray-300">
          <li>
            Without{" "}
            <code className="rounded bg-black/30 px-2 py-1">
              placeholderData
            </code>
            , UI jumps between success and pending states
          </li>
          <li>
            <code className="rounded bg-black/30 px-2 py-1">
              keepPreviousData
            </code>{" "}
            keeps old data while fetching new data
          </li>
          <li>
            <code className="rounded bg-black/30 px-2 py-1">
              isPlaceholderData
            </code>{" "}
            indicates when showing cached data
          </li>
          <li>
            Prevents disabling &ldquo;Next&rdquo; button until new data
            confirms more pages exist
          </li>
          <li>Creates a smoother, more professional pagination experience</li>
        </ul>
      </div>
    </PageContainer>
  );
}
