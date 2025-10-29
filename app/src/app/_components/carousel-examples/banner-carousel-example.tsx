"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/generic-carousel";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    BANNER CAROUSEL EXAMPLE                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates a continuous scrolling banner/ticker         ║
 * ║  effect using the autoScroll feature. Perfect for displaying              ║
 * ║  constantly moving content like stock tickers or news feeds.              ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Smooth continuous scrolling at constant speed                          ║
 * ║  • No snapping - content flows seamlessly                                 ║
 * ║  • Adjustable speed with slider control                                   ║
 * ║  • Reverse scrolling support (negative speed)                             ║
 * ║  • Infinite loop for endless scrolling                                    ║
 * ║  • Pause on hover for readability                                         ║
 * ║  • Multiple items visible at once                                         ║
 * ║                                                                           ║
 * ║  AUTO-SCROLL vs AUTOPLAY:                                                 ║
 * ║  • autoScroll: Continuous pixel-by-pixel movement (banner effect)         ║
 * ║  • autoplay: Discrete slide-by-slide progression (slideshow effect)       ║
 * ║                                                                           ║
 * ║  USE CASES:                                                               ║
 * ║  • Stock/crypto price tickers                                             ║
 * ║  • News/announcement banners                                              ║
 * ║  • Partner/sponsor logo carousels                                         ║
 * ║  • Product showcase scrollers                                             ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Render Functions
// ============================================================================

const renderItem = (asset: AssetDTO) => (
  <div className="flex h-full w-fit cursor-pointer items-center gap-4 rounded-lg border border-white/10 bg-linear-to-r from-white/5 to-white/10 px-6 py-4 transition-all hover:border-white/20 hover:from-white/10 hover:to-white/15">
    {/* Asset Logo */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={asset.image}
      alt={asset.name}
      className="h-10 w-10 shrink-0 rounded-full"
    />

    {/* Asset Info */}
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white">
          {asset.symbol.toUpperCase()}
        </span>
        <span className="text-xs text-gray-400">#{asset.rank}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">
          ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
        <span
          className={`text-xs font-medium ${
            asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {asset["24hChange"] >= 0 ? "▲" : "▼"}{" "}
          {Math.abs(asset["24hChange"]).toFixed(2)}%
        </span>
      </div>
    </div>
  </div>
);

const renderLoadingItem = () => (
  <div className="flex h-full items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-6 py-4">
    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
    <div className="flex flex-col gap-2">
      <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * BannerCarouselExample
 *
 * Demonstrates continuous auto-scroll for banner/ticker effects.
 * Unlike autoplay which snaps between slides, autoScroll provides
 * smooth pixel-by-pixel movement for a true ticker experience.
 *
 * AUTO-SCROLL API:
 * • autoScrollSpeed: Pixels per frame
 *   - Positive values: Scroll forward
 *   - Negative values: Scroll backward
 *   - Higher magnitude: Faster scroll
 *
 * CONFIGURATION:
 * • Must enable loop: true for infinite scrolling
 * • Set dragFree: false to maintain smooth scrolling
 * • Use "auto" itemsPerView for fluid layout
 * • Disable navigation/dots for clean ticker look
 */
export default function BannerCarouselExample() {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [speed, setSpeed] = useState<number>(1);
  const [resumeDelay, setResumeDelay] = useState<number>(0);

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

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

  // Get first page of assets (already in AssetDTO format)
  const assets: AssetDTO[] = data?.pages[0]?.items ?? [];

  // ==========================================================================
  // RENDER
  // ==========================================================================

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
        <div className="space-y-4">
          {/* Speed Control */}
          <div className="space-y-2">
            <Label htmlFor="speed">
              Scroll Speed: {speed.toFixed(1)} px/frame
            </Label>
            <input
              id="speed"
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-primary w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>← Reverse (-3)</span>
              <span>Stop (0)</span>
              <span>Forward (3) →</span>
            </div>
          </div>

          {/* Resume Delay Control */}
          <div className="space-y-2">
            <Label htmlFor="resumeDelay">
              Resume Delay: {(resumeDelay / 1000).toFixed(1)}s{" "}
              {resumeDelay === 0 ? "(Default)" : ""}
            </Label>
            <input
              id="resumeDelay"
              type="range"
              min="0"
              max="2000"
              step="100"
              value={resumeDelay}
              onChange={(e) => setResumeDelay(Number(e.target.value))}
              className="accent-primary w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Instant (0s)</span>
              <span>2 seconds</span>
            </div>
          </div>

          {/* Info Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded border border-white/10 bg-black/20 p-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  Direction:{" "}
                  {speed === 0
                    ? "Stopped"
                    : speed > 0
                      ? "Forward →"
                      : "← Backward"}
                </div>
                <div className="text-xs text-gray-400">
                  {speed === 0
                    ? "Adjust slider to start scrolling"
                    : `Moving at ${Math.abs(speed).toFixed(1)} pixels per frame`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {Math.abs(speed).toFixed(1)}x
                </div>
                <div className="text-xs text-gray-400">Speed</div>
              </div>
            </div>

            <div className="rounded border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-medium">
                Resume Delay: {(resumeDelay / 1000).toFixed(1)}s
              </div>
              <div className="text-xs text-gray-400">
                {resumeDelay === 0
                  ? "Resumes immediately after mouse leaves"
                  : `Waits ${(resumeDelay / 1000).toFixed(1)}s after mouse leaves to resume`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30 py-4">
        <Carousel<AssetDTO>
          items={assets}
          renderItem={renderItem}
          renderLoadingItem={renderLoadingItem}
          isLoading={isLoading}
          loadingCount={6}
          itemsPerView="auto"
          gap={12}
          navigation={{ show: false }}
          dots={{ show: false }}
          orientation="horizontal"
          loop
          dragFree={false}
          autoScroll={{
            enabled: true,
            speed,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            resumeDelay,
          }}
          className="px-4"
        />
      </div>

      {/* Technical Details */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 font-semibold">How It Works</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <span className="text-lg">🔄</span>
            <div>
              <strong className="text-white">Continuous Scrolling:</strong>{" "}
              Unlike autoplay which snaps between slides, autoScroll moves
              smoothly pixel-by-pixel for a true banner effect.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">⚡</span>
            <div>
              <strong className="text-white">Speed Control:</strong> The{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                autoScrollSpeed
              </code>{" "}
              prop controls pixels moved per frame. Positive scrolls forward,
              negative scrolls backward.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">🔁</span>
            <div>
              <strong className="text-white">Infinite Loop:</strong> With{" "}
              <code className="rounded bg-black/30 px-2 py-1">loop=true</code>,
              the carousel seamlessly wraps around for endless scrolling.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">⏸️</span>
            <div>
              <strong className="text-white">Hover to Pause:</strong> Set{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                autoScrollStopOnMouseEnter=true
              </code>{" "}
              to pause scrolling when users hover, making content readable.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">⏱️</span>
            <div>
              <strong className="text-white">Resume Delay:</strong> Use{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                resumeDelay
              </code>{" "}
              in the autoScroll config to set a delay (in milliseconds) before
              resuming scroll after mouse leaves. Perfect for giving users time
              to finish reading.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">📏</span>
            <div>
              <strong className="text-white">Auto Width:</strong> Using{" "}
              <code className="rounded bg-black/30 px-2 py-1">
                itemsPerView=&quot;auto&quot;
              </code>{" "}
              lets items determine their own width for flexible layouts.
            </div>
          </div>
        </div>
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
