"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/generic-carousel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";
import type { CarouselApi } from "@/app/_components/generic-carousel";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    AUTOPLAY CAROUSEL EXAMPLE                              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates an autoplay carousel with interactive        ║
 * ║  controls for delay, items per view, and manual playback control.         ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Automatic slide progression with speed control (0-1 scale)             ║
 * ║  • Adjustable time limit (2s, 3s, 5s, 10s)                                ║
 * ║  • Speed slider for real-time delay adjustment                            ║
 * ║  • Formula display: delay = (limit / speed) seconds                       ║
 * ║  • Dynamic items per view (1, 2, 3, 4)                                    ║
 * ║  • Play/Pause controls via Carousel API                                   ║
 * ║  • Stops on mouse hover (hover-to-pause)                                  ║
 * ║  • Inside navigation positioning                                          ║
 * ║  • Progress indicator with pagination dots                                ║
 * ║                                                                           ║
 * ║  AUTOPLAY SPEED API:                                                      ║
 * ║  speed: 0-1 scale where 1 = fastest                                       ║
 * ║  limit: base time unit in seconds                                         ║
 * ║  Formula: delay = (limit / speed) * 1000ms                                ║
 * ║  Example: speed=0.5, limit=3 → 6000ms delay                               ║
 * ║                                                                           ║
 * ║  CAROUSEL API INTEGRATION:                                                ║
 * ║  The Carousel component exposes an API via onApiReady callback that       ║
 * ║  provides access to Embla's autoplay plugin methods:                      ║
 * ║  • api.plugins().autoplay.play()                                          ║
 * ║  • api.plugins().autoplay.stop()                                          ║
 * ║  • api.plugins().autoplay.reset()                                         ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Render Functions
// ============================================================================

const renderItem = (asset: AssetDTO) => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 transition-all hover:border-white/20 hover:from-white/15 hover:to-white/10">
    {/* Asset Header */}
    <div className="mb-4 flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.image}
        alt={asset.name}
        className="h-16 w-16 rounded-full ring-2 ring-white/10"
      />
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-xl font-bold">{asset.name}</h3>
        <p className="text-sm text-gray-400">
          {asset.symbol.toUpperCase()} • #{asset.rank}
        </p>
      </div>
    </div>

    {/* Price Display */}
    <div className="mb-6 text-center">
      <div className="text-3xl font-bold">
        ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <div
        className={`mt-2 text-lg font-semibold ${
          asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {asset["24hChange"] >= 0 ? "▲" : "▼"}{" "}
        {Math.abs(asset["24hChange"]).toFixed(2)}%
      </div>
    </div>

    {/* Stats Grid */}
    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
      <div>
        <div className="text-xs text-gray-400">Market Cap</div>
        <div className="mt-1 font-semibold">
          ${(asset.marketCap / 1e9).toFixed(2)}B
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-400">Volume</div>
        <div className="mt-1 font-semibold">
          ${(asset.totalVolume / 1e9).toFixed(2)}B
        </div>
      </div>
    </div>
  </div>
);

const renderLoadingItem = () => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
    <div className="mb-4 flex items-center gap-4">
      <div className="h-16 w-16 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
      </div>
    </div>
    <div className="mb-6 text-center">
      <div className="mx-auto h-10 w-40 animate-pulse rounded bg-white/10" />
      <div className="mx-auto mt-2 h-6 w-24 animate-pulse rounded bg-white/10" />
    </div>
    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
      <div className="h-10 animate-pulse rounded bg-white/10" />
      <div className="h-10 animate-pulse rounded bg-white/10" />
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * AutoplayCarouselExample
 *
 * An advanced carousel with autoplay functionality and interactive controls.
 * Demonstrates the new speed/limit API for intuitive autoplay configuration.
 *
 * AUTOPLAY SPEED API:
 * • speed (0-1): Controls how fast slides advance
 *   - 1.0 = fastest (delay = limit seconds)
 *   - 0.5 = medium (delay = limit * 2 seconds)
 *   - 0.1 = slowest (delay = limit * 10 seconds)
 * • limit (seconds): Base time unit for calculations
 * • Formula: delay = (limit / speed) * 1000ms
 *
 * EXAMPLE CALCULATIONS:
 * • speed=1.0, limit=3 → 3 second delay
 * • speed=0.5, limit=3 → 6 second delay
 * • speed=0.3, limit=5 → 16.7 second delay
 *
 * AUTOPLAY BEHAVIOR:
 * • Automatically advances slides at calculated interval
 * • Pauses on mouse hover (stopOnMouseEnter: true)
 * • Pauses on user interaction (stopOnInteraction: true)
 * • Can be controlled via play/pause buttons using API
 *
 * API ACCESS:
 * The onApiReady callback provides access to Embla's API, including
 * the autoplay plugin which can be controlled programmatically.
 */
export default function AutoplayCarouselExample() {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [speed, setSpeed] = useState<number>(0.5);
  const [limit, setLimit] = useState<number>(3);
  const [itemsPerView, setItemsPerView] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Calculate actual delay for display
  const actualDelay = (limit / speed) * 1000;

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

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

  // Get first page of assets (already in AssetDTO format)
  const assets: AssetDTO[] = data?.pages[0]?.items ?? [];

  // ==========================================================================
  // AUTOPLAY CONTROLS
  // ==========================================================================

  const handlePlayPause = () => {
    if (!carouselApi) return;

    // Access autoplay plugin from Embla API
    const autoplay = carouselApi.plugins()?.autoplay;
    if (!autoplay) return;

    if (isPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  };

  const handleApiReady = (api: CarouselApi) => {
    setCarouselApi(api);
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

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
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          {/* Autoplay Speed (0-1) */}
          <div className="space-y-2">
            <Label htmlFor="speed">
              Autoplay Speed: {speed.toFixed(2)}
            </Label>
            <input
              id="speed"
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Slow (0.1)</span>
              <span>Fast (1.0)</span>
            </div>
          </div>

          {/* Autoplay Limit */}
          <div className="space-y-2">
            <Label htmlFor="limit">Time Limit: {limit}s</Label>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger id="limit">
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 seconds</SelectItem>
                <SelectItem value="3">3 seconds</SelectItem>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Per View */}
          <div className="space-y-2">
            <Label htmlFor="itemsPerView">Items Per View</Label>
            <Select
              value={itemsPerView.toString()}
              onValueChange={(value) => setItemsPerView(Number(value))}
            >
              <SelectTrigger id="itemsPerView">
                <SelectValue placeholder="Select items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 item</SelectItem>
                <SelectItem value="2">2 items</SelectItem>
                <SelectItem value="3">3 items</SelectItem>
                <SelectItem value="4">4 items</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Per View - moved from above */}
        </div>

        {/* Playback Control & Info */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Actual Delay: {(actualDelay / 1000).toFixed(1)}s
            </div>
            <div className="text-xs text-gray-400">
              Formula: (limit / speed) = ({limit} / {speed.toFixed(1)}) ={" "}
              {(actualDelay / 1000).toFixed(1)}s
            </div>
          </div>
          <Button
            onClick={handlePlayPause}
            disabled={!carouselApi || isLoading}
            size="lg"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </Button>
        </div>

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
        renderItem={renderItem}
        renderLoadingItem={renderLoadingItem}
        isLoading={isLoading}
        loadingCount={itemsPerView}
        itemsPerView={itemsPerView}
        gap={24}
        navigation={{ show: true, position: "inside" }}
        dots={{ show: true, position: "inside" }}
        loop
        autoplay={{
          enabled: true,
          speed,
          limit,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }}
        onApiReady={handleApiReady}
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
