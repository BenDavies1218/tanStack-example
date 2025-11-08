import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import BasicCarouselExample from "@/app/_components/carousel-examples/basic-carousel-example";
import AutoplayCarouselExample from "@/app/_components/carousel-examples/autoplay-carousel-example";
import LoadingCarouselExample from "@/app/_components/carousel-examples/loading-carousel-example";
import InfiniteCarouselExample from "@/app/_components/carousel-examples/infinite-carousel-example";
import BannerCarouselExample from "@/app/_components/carousel-examples/banner-carousel-example";
import SandboxCarouselExample from "@/app/_components/carousel-examples/sandbox-carousel-example";

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="autoplay">Autoplay</TabsTrigger>
          <TabsTrigger value="banner">Banner</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="infinite">Infinite</TabsTrigger>
          <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
        </TabsList>

        {/* Basic Carousel Tab */}
        <TabsContent value="basic" className="mt-6">
          <BasicCarouselExample />
        </TabsContent>

        {/* Sandbox Carousel Tab */}
        <TabsContent value="sandbox" className="mt-6">
          <div className="mx-auto w-full max-w-[1800px]">
            <SandboxCarouselExample />
          </div>
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
    </div>
  );
}
