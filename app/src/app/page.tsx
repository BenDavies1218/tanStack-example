import Link from "next/link";

export default function Home() {
  const core = [
    {
      title: "useQuery",
      href: "/use-query",
      description: "Basic query fetching with loading and error states",
      icon: "📊",
    },
    {
      title: "useQueries",
      href: "/use-queries",
      description: "Execute multiple queries in parallel with dynamic patterns",
      icon: "🔄",
    },
    {
      title: "useMutation",
      href: "/use-mutation",
      description: "Create, update, and delete data with mutations",
      icon: "✏️",
    },
    {
      title: "useInfiniteQuery",
      href: "/use-infinite-query",
      description: "Infinite scrolling and cursor-based pagination",
      icon: "♾️",
    },
    {
      title: "Paginated Queries",
      href: "/paginated-queries",
      description: "Smooth pagination with keepPreviousData",
      icon: "📄",
    },
    {
      title: "Optimistic Updates",
      href: "/optimistic-updates",
      description: "Update UI instantly before server confirmation",
      icon: "⚡",
    },
  ];

  const components = [
    {
      title: "Paginated Tables",
      href: "/assets/paginated/table",
      description: "Data table with pagination and search and filtering",
      icon: "🐘",
    },
    {
      title: "Paginated Carousels",
      href: "/assets/paginated/carousel",
      description:
        "Carousel component with paginated data fetching, filtering and sorting",
      icon: "🐘",
    },
    {
      title: "Infinite Scrolling Tables",
      href: "/assets/infinite/table",
      description:
        "Data table with inifinite scrolling and virtualized rows, filtering and sorting",
      icon: "🍃",
    },
    {
      title: "Infinite Scrolling Carousels",
      href: "/assets/infinite/carousel",
      description:
        "Carousel component with infinite scrolling and virtualized rows, filtering and sorting",
      icon: "🍃",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="container mx-auto flex flex-col gap-16 px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            TRPC & TanStack Query{" "}
            <span className="text-[hsl(144,100%,70%)]">Examples</span>
          </h1>
          <p className="text-xl text-gray-300">
            Learn useQuery, useMutation, useInfiniteQuery, and more with
            interactive demos
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto max-w-2xl rounded-xl bg-white/5 p-8">
            <h2 className="mb-4 text-2xl font-bold">About This Project</h2>
            <p className="mb-4 text-gray-300">
              This demo showcases TanStack Query (React Query) with tRPC and
              Next.js. Each example demonstrates different patterns and best
              practices for data fetching and state management.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-purple-500/20 px-4 py-2 text-sm">
                TanStack Query
              </span>
              <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm">
                tRPC
              </span>
              <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm">
                Next.js 15
              </span>
              <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm">
                TypeScript
              </span>
              <span className="rounded-full bg-pink-500/20 px-4 py-2 text-sm">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 text-center">
          <h1 className="mb-4 text-5xl font-bold">Core</h1>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {core.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group flex flex-col gap-4 rounded-xl bg-white/10 p-6 transition-all hover:scale-105 hover:bg-white/20"
              >
                <div className="text-4xl">{example.icon}</div>
                <h3 className="text-2xl font-bold group-hover:text-[hsl(133,100%,70%)]">
                  {example.title}
                </h3>
                <p className="text-sm text-gray-300">{example.description}</p>
                <div className="mt-auto text-sm font-semibold text-green-300">
                  View Example →
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 text-center">
          <h1 className="mb-4 text-5xl font-bold">Components</h1>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {components.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group flex flex-col gap-4 rounded-xl bg-white/10 p-6 transition-all hover:scale-105 hover:bg-white/20"
              >
                <div className="text-4xl">{example.icon}</div>
                <h3 className="text-2xl font-bold group-hover:text-[hsl(133,100%,70%)]">
                  {example.title}
                </h3>
                <p className="text-sm text-gray-300">{example.description}</p>
                <div className="mt-auto text-sm font-semibold text-green-300">
                  View Example →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
