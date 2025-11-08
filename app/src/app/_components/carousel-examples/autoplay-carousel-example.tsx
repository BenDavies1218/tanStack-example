"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/Generics/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";
import { BannerCarouselItem, BannerCarouselItemLoading } from "./items/banner";
import { AutoPlayInputControls } from "./controls/auto-play";

export default function AutoPlayCarouselExample() {
  const [speed, setSpeed] = useState<number>(1);
  const [resumeDelay, setResumeDelay] = useState<number>(0);

  const { data, isLoading, isError } =
    api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
      {
        limit: 30,
        sortBy: "rank",
        sortOrder: "asc",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        throwOnError: () => {
          toast.error("Failed to fetch banner data", {
            description: "An error occurred while fetching banner data",
          });
          return false;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    );

  const assets: AssetDTO[] = data?.pages[0]?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="rounded-lg bg-white/10 p-6">
        <h2 className="mb-2 text-xl font-semibold">Banner/Ticker Carousel</h2>
        <p className="text-sm text-gray-400">
          A continuously scrolling banner showing crypto prices in real-time.
          Uses autoScroll for smooth pixel-by-pixel movement without snapping.
          Hover to pause and read details.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>• Infinite loop</span>
          <span>• Continuous scroll</span>
          <span>• Hover to pause</span>
          <span>• Adjustable speed</span>
          <span>• Resume delay</span>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg bg-white/10 p-6">
        <AutoPlayInputControls
          speed={speed}
          resumeDelay={resumeDelay}
          onSpeedChange={setSpeed}
          onResumeDelayChange={setResumeDelay}
        />
      </div>

      {/* Banner Carousel */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30 py-4">
        <Carousel<AssetDTO>
          items={assets}
          renderItem={BannerCarouselItem}
          renderLoadingItem={BannerCarouselItemLoading}
          isLoading={isLoading}
          loadingCount={6}
          itemsPerView="auto"
          gap={12}
          navigation={{ show: false }}
          dots={{ show: false }}
          orientation="horizontal"
          loop
          dragFree={false}
          autoplay={{
            enabled: true,
            speed,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            resumeDelay,
          }}
          className="px-4"
        />
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400">
            Failed to load banner data. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
