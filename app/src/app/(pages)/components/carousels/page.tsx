import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicCarouselExample from "@/app/_components/carousel-examples/basic-carousel-example";
import AutoScrollCarouselExample from "@/app/_components/carousel-examples/autoscroll-carousel-example";
import InfiniteCarouselExample from "@/app/_components/carousel-examples/infinite-carousel-example";
import AutoPlayCarouselExample from "@/app/_components/carousel-examples/autoplay-carousel-example";
import SandboxCarouselExample from "@/app/_components/carousel-examples/sandbox-carousel-example";
import CarouselPropsTable from "@/app/_components/carousel-examples/carousel-props-table";

enum TabValues {
  BASIC = "basic",
  AUTO_PLAY = "autoPlay",
  AUTO_SCROLL = "autoScroll",
  INFINITE = "infinite",
  SANDBOX = "sandbox",
}
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
      <Tabs defaultValue={TabValues.BASIC} className="w-full">
        <TabsList className="flex w-full justify-around">
          <TabsTrigger value={TabValues.BASIC}>Basic</TabsTrigger>
          <TabsTrigger value={TabValues.AUTO_PLAY}>Autoplay</TabsTrigger>
          <TabsTrigger value={TabValues.AUTO_SCROLL}>AutoScroll</TabsTrigger>
          <TabsTrigger value={TabValues.INFINITE}>Infinite</TabsTrigger>
          <TabsTrigger value={TabValues.SANDBOX}>Sandbox</TabsTrigger>
        </TabsList>

        {/* Basic Carousel Tab */}
        <TabsContent value={TabValues.BASIC} className="mt-6">
          <BasicCarouselExample />
          <div className="mt-4 text-center text-sm text-gray-400">
            Example of a basic carousel displaying various crypto assets.
          </div>

          <CarouselPropsTable />
        </TabsContent>

        {/* Autoplay Carousel Tab */}
        <TabsContent value={TabValues.AUTO_SCROLL} className="mt-6">
          <AutoScrollCarouselExample />
        </TabsContent>

        {/* Auto Play Carousel Tab */}
        <TabsContent value={TabValues.AUTO_PLAY} className="mt-6">
          <AutoPlayCarouselExample />
        </TabsContent>

        {/* Infinite Carousel Tab */}
        <TabsContent value={TabValues.INFINITE} className="mt-6">
          <InfiniteCarouselExample />
        </TabsContent>

        {/* Sandbox Carousel Tab */}
        <TabsContent value={TabValues.SANDBOX} className="mt-6">
          <div className="mx-auto w-full max-w-[1800px]">
            <SandboxCarouselExample />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
