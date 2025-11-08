"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/Generics/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";
import { BasicCarouselItem, BasicCarouselItemLoading } from "./items/basic";
import { AutoScrollInputControls } from "./controls/auto-scroll";

export default function AutoplayCarouselExample() {
  const [interval, setInterval] = useState<number>(3000); // milliseconds
  const [speed, setSpeed] = useState<number>(300); // milliseconds
  const [itemsPerView, setItemsPerView] = useState<number>(3);

  const { data, isLoading, isError } =
    api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
      {
        limit: 20,
        sortBy: "rank",
        sortOrder: "asc",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        throwOnError: () => {
          toast.error("Failed to fetch carousel data", {
            description: "An error occurred while fetching carousel data",
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
        <h2 className="mb-2 text-xl font-semibold">Autoplay Carousel</h2>
        <p className="text-sm text-gray-400">
          An automatically advancing carousel with configurable settings. The
          carousel pauses on hover and can be controlled with the play/pause
          button below.
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-lg bg-white/10 p-6">
        <AutoScrollInputControls
          interval={interval}
          speed={speed}
          itemsPerView={itemsPerView}
          onIntervalChange={setInterval}
          onSpeedChange={setSpeed}
          onItemsPerViewChange={setItemsPerView}
        />

        <div className="mt-4 flex gap-4 text-xs text-gray-500">
          <span>• Hover to pause</span>
          <span>• Loop enabled</span>
          <span>• Inside navigation</span>
          <span>• Pagination dots</span>
        </div>
      </div>

      {/* Carousel */}
      <Carousel<AssetDTO>
        items={assets}
        renderItem={BasicCarouselItem}
        renderLoadingItem={BasicCarouselItemLoading}
        isLoading={isLoading}
        loadingCount={itemsPerView}
        itemsPerView={itemsPerView}
        gap={24}
        navigation={{ show: true, position: "inside" }}
        dots={{ show: true, position: "inside" }}
        loop
        autoScroll={{
          enabled: true,
          interval,
          speed,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }}
        className="rounded-lg bg-black/20 px-4 py-8"
        itemClassName="h-96"
      />

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400">
            Failed to load carousel data. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
