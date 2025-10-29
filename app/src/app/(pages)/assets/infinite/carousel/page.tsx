import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import BasicCarouselExample from "@/app/_components/carousel-examples/basic-carousel-example";
import AutoplayCarouselExample from "@/app/_components/carousel-examples/autoplay-carousel-example";
import LoadingCarouselExample from "@/app/_components/carousel-examples/loading-carousel-example";
import InfiniteCarouselExample from "@/app/_components/carousel-examples/infinite-carousel-example";
import BannerCarouselExample from "@/app/_components/carousel-examples/banner-carousel-example";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                       CAROUSEL EXAMPLES PAGE                              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This page showcases various carousel implementations using the           ║
 * ║  generic Carousel component with TanStack Query integration.              ║
 * ║                                                                           ║
 * ║  EXAMPLES INCLUDED:                                                       ║
 * ║  1. Basic Carousel - Simple carousel with crypto assets                   ║
 * ║  2. Autoplay Carousel - Auto-advancing with play/pause controls           ║
 * ║  3. Banner/Ticker - Continuous scrolling banner effect                    ║
 * ║  4. Loading States - Skeleton loaders and empty states                    ║
 * ║  5. Infinite Carousel - useInfiniteQuery with load more                   ║
 * ║                                                                           ║
 * ║  ROUTE: /assets/infinite/carousel                                         ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export default function CarouselExamplesPage() {
  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-4 text-4xl font-bold">Carousel Examples</h1>
        <p className="text-muted-foreground mt-2">
          Explore various carousel implementations with TanStack Query,
          featuring autoplay, infinite loading, and interactive controls.
        </p>
      </div>

      {/* Carousel Examples Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="autoplay">Autoplay</TabsTrigger>
          <TabsTrigger value="banner">Banner</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="infinite">Infinite</TabsTrigger>
        </TabsList>

        {/* Basic Carousel Tab */}
        <TabsContent value="basic" className="mt-6">
          <BasicCarouselExample />
        </TabsContent>

        {/* Autoplay Carousel Tab */}
        <TabsContent value="autoplay" className="mt-6">
          <AutoplayCarouselExample />
        </TabsContent>

        {/* Banner/Ticker Carousel Tab */}
        <TabsContent value="banner" className="mt-6">
          <BannerCarouselExample />
        </TabsContent>

        {/* Loading States Tab */}
        <TabsContent value="loading" className="mt-6">
          <LoadingCarouselExample />
        </TabsContent>

        {/* Infinite Carousel Tab */}
        <TabsContent value="infinite" className="mt-6">
          <InfiniteCarouselExample />
        </TabsContent>
      </Tabs>

      {/* Documentation Section */}
      <div className="mt-12 space-y-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold">About These Examples</h2>

          <div className="space-y-6">
            {/* Basic Carousel */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400">
                <span className="rounded-full bg-blue-400/20 px-2 py-1 text-xs">
                  1
                </span>
                Basic Carousel
              </h3>
              <p className="text-sm text-gray-400">
                A simple carousel implementation perfect for learning the
                fundamentals. Displays the top 12 cryptocurrencies with 3 items
                per view, navigation arrows, and pagination dots. Features loop
                behavior and loading states.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-white/10 px-2 py-1">
                  3 items per view
                </span>
                <span className="rounded bg-white/10 px-2 py-1">Loop</span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Navigation
                </span>
                <span className="rounded bg-white/10 px-2 py-1">Dots</span>
              </div>
            </div>

            {/* Autoplay Carousel */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-400">
                <span className="rounded-full bg-purple-400/20 px-2 py-1 text-xs">
                  2
                </span>
                Autoplay Carousel
              </h3>
              <p className="text-sm text-gray-400">
                An advanced carousel with automatic slide progression.
                Demonstrates the Carousel API for programmatic control with
                play/pause buttons. Features configurable autoplay delay (2s,
                3s, 5s), dynamic items per view (1-4), and hover-to-pause
                functionality.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-white/10 px-2 py-1">
                  Speed/Limit API
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  API Control
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Hover Pause
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Inside Nav
                </span>
              </div>
            </div>

            {/* Banner/Ticker Carousel */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-400">
                <span className="rounded-full bg-cyan-400/20 px-2 py-1 text-xs">
                  3
                </span>
                Banner/Ticker Carousel
              </h3>
              <p className="text-sm text-gray-400">
                Continuous scrolling banner with smooth pixel-by-pixel movement.
                Perfect for stock tickers, news feeds, or sponsor logos. Features
                adjustable speed (including reverse), pause on hover, and true
                infinite scrolling without snapping.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-white/10 px-2 py-1">
                  Auto-scroll
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Constant Speed
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Reverse Support
                </span>
                <span className="rounded bg-white/10 px-2 py-1">No Snapping</span>
              </div>
            </div>

            {/* Loading States */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-400">
                <span className="rounded-full bg-yellow-400/20 px-2 py-1 text-xs">
                  4
                </span>
                Loading States
              </h3>
              <p className="text-sm text-gray-400">
                Demonstrates loading and empty states for async data fetching
                scenarios. Features configurable loading duration (1-3s),
                adjustable skeleton item count (2-4), and custom empty state
                messages. Perfect for understanding UX during data operations.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-white/10 px-2 py-1">
                  Skeletons
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Empty State
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Simulated Load
                </span>
                <span className="rounded bg-white/10 px-2 py-1">Mock Data</span>
              </div>
            </div>

            {/* Infinite Carousel */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-green-400">
                <span className="rounded-full bg-green-400/20 px-2 py-1 text-xs">
                  5
                </span>
                Infinite Carousel
              </h3>
              <p className="text-sm text-gray-400">
                Full TanStack Query useInfiniteQuery integration with
                cursor-based pagination. Features server-side filtering
                (category & search), client-side sorting, and a &quot;Load
                More&quot; button for dynamic data loading. Displays real-time
                stats for total items and pages loaded.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-white/10 px-2 py-1">
                  useInfiniteQuery
                </span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Load More
                </span>
                <span className="rounded bg-white/10 px-2 py-1">Filtering</span>
                <span className="rounded bg-white/10 px-2 py-1">Sorting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Technical Details</h2>

          <div className="space-y-4 text-sm text-gray-400">
            <div>
              <h4 className="mb-2 font-semibold text-white">Data Source</h4>
              <p>
                All examples (except Loading States) fetch data from MongoDB via
                tRPC using the <code className="rounded bg-black/30 px-2 py-1">
                  api.infinite.getInfiniteDataMongoDB
                </code> endpoint. Data is returned in <code className="rounded bg-black/30 px-2 py-1">
                  AssetDTO
                </code> format with full type safety.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">
                Component Architecture
              </h4>
              <p>
                All carousels use the generic{" "}
                <code className="rounded bg-black/30 px-2 py-1">Carousel</code>{" "}
                component from{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  @/app/_components/generic-carousel
                </code>
                . Built on shadcn/ui&apos;s carousel (Embla Carousel) with
                additional features for loading states, empty states, and
                TanStack Query integration.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">Key Features</h4>
              <ul className="ml-4 list-disc space-y-1">
                <li>Type-safe with TypeScript generics</li>
                <li>Flexible render functions for customization</li>
                <li>Built-in loading and empty state handling</li>
                <li>Multiple navigation styles (default, inside, outside)</li>
                <li>Pagination dots with configurable positions</li>
                <li>Embla plugins (autoplay, auto-scroll, class names)</li>
                <li>Carousel API for programmatic control</li>
                <li>Responsive layouts with configurable items per view</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">File Locations</h4>
              <div className="space-y-1 font-mono text-xs">
                <p>
                  <span className="text-gray-500">Generic Component:</span>{" "}
                  <code className="text-blue-400">
                    src/app/_components/generic-carousel.tsx
                  </code>
                </p>
                <p>
                  <span className="text-gray-500">Examples:</span>{" "}
                  <code className="text-blue-400">
                    src/app/_components/carousel-examples/
                  </code>
                </p>
                <p>
                  <span className="text-gray-500">tRPC Router:</span>{" "}
                  <code className="text-blue-400">
                    src/server/api/routers/infinite.ts
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Usage Tips</h2>

          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <strong className="text-white">Performance:</strong> Use{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  itemsPerView
                </code>{" "}
                to control how many items render at once. Lower values improve
                performance with heavy components.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">🎨</span>
              <div>
                <strong className="text-white">Customization:</strong> All
                render functions (
                <code className="rounded bg-black/30 px-2 py-1">
                  renderItem
                </code>
                ,{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  renderLoadingItem
                </code>
                ,{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  renderEmptyItem
                </code>
                ) are fully customizable to match your design system.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">⚡</span>
              <div>
                <strong className="text-white">Data Fetching:</strong> For
                static data, use a regular{" "}
                <code className="rounded bg-black/30 px-2 py-1">useQuery</code>.
                For paginated data with &quot;Load More&quot;, use{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  useInfiniteQuery
                </code>
                .
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">🎯</span>
              <div>
                <strong className="text-white">Autoplay:</strong> Use{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  stopOnMouseEnter: true
                </code>{" "}
                for better UX - users can read content by hovering.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">📱</span>
              <div>
                <strong className="text-white">Responsive:</strong> Combine with
                CSS media queries or responsive{" "}
                <code className="rounded bg-black/30 px-2 py-1">
                  itemsPerView
                </code>{" "}
                values for mobile-friendly layouts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
