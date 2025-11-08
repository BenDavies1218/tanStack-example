"use client";

import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/Generics/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Copy, Check } from "lucide-react";
import { useSandboxCarouselState } from "@/app/_hooks/use-sandbox-carousel-state";
import {
  createRenderItem,
  createRenderLoadingItem,
  createRenderEmptyItem,
} from "./sandbox-render-functions";
import { generateCarouselCode } from "@/app/_utils/generate-carousel-code";
import {
  CarouselConfigPanel,
  LayoutStyleConfigPanel,
} from "./sandbox-config-panels";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                      SANDBOX CAROUSEL EXAMPLE                             ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Interactive sandbox for experimenting with carousel configurations.      ║
 * ║  Features compact side-by-side layout with modular architecture.          ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Carousel configuration (items, gap, nav, dots, loop, drag)             ║
 * ║  • Layout & dimensions (max-width, item height)                           ║
 * ║  • Color system (primary, accent, bg, border)                             ║
 * ║  • Real-time preview with custom styling                                  ║
 * ║  • Code export with full configuration                                    ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export default function SandboxCarouselExample() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const state = useSandboxCarouselState();

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
    {
      limit: state.dataLimit,
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

  // ==========================================================================
  // DATA TRANSFORMATION
  // ==========================================================================

  // Flatten all pages into single array - useMemo prevents unnecessary re-renders
  const assets: AssetDTO[] = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  // ==========================================================================
  // RENDER FUNCTIONS
  // ==========================================================================

  const renderItem = useMemo(() => createRenderItem(), []);

  const renderLoadingItem = useMemo(() => createRenderLoadingItem(), []);

  const renderEmptyItem = useMemo(() => createRenderEmptyItem(), []);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleCopyCode = async () => {
    const code = generateCarouselCode({
      itemsPerView: state.itemsPerView,
      gap: state.gap,
      loop: state.loop,
      dragFree: state.dragFree,
      navStyle: state.navStyle,
      dotsPosition: state.dotsPosition,
      dataLimit: state.dataLimit,
      orientation: state.orientation,
      rows: state.rows,
      columns: state.columns,
      autoPlay: state.autoPlay,
      autoPlaySpeed: state.autoPlaySpeed,
      autoPlayStopOnMouseEnter: state.autoPlayStopOnMouseEnter,
      autoPlayResumeDelay: state.autoPlayResumeDelay,
      autoScroll: state.autoScroll,
      autoScrollInterval: state.autoScrollInterval,
      autoScrollSpeed: state.autoScrollSpeed,
      autoScrollStopOnMouseEnter: state.autoScrollStopOnMouseEnter,
      maxWidth: state.maxWidth,
      paddingY: state.paddingY,
      bgColor: state.bgColor,
      borderColor: state.borderColor,
      showCode: state.showCode,
      copied: state.copied,
    });

    await navigator.clipboard.writeText(code);
    state.setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => state.setCopied(false), 2000);
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 p-6">
        <h2 className="mb-2 text-xl font-semibold">Carousel Sandbox</h2>
        <p className="text-sm opacity-70">
          Experiment with carousel configurations. Adjust settings in real-time
          to see how they affect behavior and appearance.
        </p>
      </div>

      {/* Configuration & Preview Side-by-Side */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: Configuration Panels */}
        <div className="space-y-4">
          {/* Carousel Config Panel */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <CarouselConfigPanel
              itemsPerView={state.itemsPerView}
              gap={state.gap}
              loop={state.loop}
              dragFree={state.dragFree}
              navStyle={state.navStyle}
              dotsPosition={state.dotsPosition}
              dataLimit={state.dataLimit}
              orientation={state.orientation}
              rows={state.rows}
              columns={state.columns}
              autoPlay={state.autoPlay}
              autoPlaySpeed={state.autoPlaySpeed}
              autoPlayStopOnMouseEnter={state.autoPlayStopOnMouseEnter}
              autoScroll={state.autoScroll}
              autoScrollInterval={state.autoScrollInterval}
              autoScrollSpeed={state.autoScrollSpeed}
              autoScrollStopOnMouseEnter={state.autoScrollStopOnMouseEnter}
              onItemsPerViewChange={state.setItemsPerView}
              onGapChange={state.setGap}
              onLoopChange={state.setLoop}
              onDragFreeChange={state.setDragFree}
              onNavStyleChange={state.setNavStyle}
              onDotsPositionChange={state.setDotsPosition}
              onDataLimitChange={state.setDataLimit}
              onOrientationChange={state.setOrientation}
              onRowsChange={state.setRows}
              onColumnsChange={state.setColumns}
              onAutoPlayChange={state.setAutoPlay}
              onAutoPlaySpeedChange={state.setAutoPlaySpeed}
              onAutoPlayStopOnMouseEnterChange={
                state.setAutoPlayStopOnMouseEnter
              }
              onAutoScrollChange={state.setAutoScroll}
              onAutoScrollIntervalChange={state.setAutoScrollInterval}
              onAutoScrollSpeedChange={state.setAutoScrollSpeed}
              onAutoScrollStopOnMouseEnterChange={
                state.setAutoScrollStopOnMouseEnter
              }
              onRefetch={() => void refetch()}
            />
          </div>

          {/* Layout & Style Config Panel */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <LayoutStyleConfigPanel
              maxWidth={state.maxWidth}
              paddingY={state.paddingY}
              bgColor={state.bgColor}
              borderColor={state.borderColor}
              onMaxWidthChange={state.setMaxWidth}
              onPaddingYChange={state.setPaddingY}
              onBgColorChange={state.setBgColor}
              onBorderColorChange={state.setBorderColor}
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={state.resetConfig}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Right: Carousel Preview */}
        <div className="space-y-6">
          {/* Preview Card - Colors applied to carousel container */}
          <div
            className="rounded-lg"
            style={{
              maxWidth: `${state.maxWidth}px`,
              margin: "0 auto",
              backgroundColor: state.bgColor,
              borderColor: state.borderColor,
              borderWidth: "2px",
              borderStyle: "solid",
              paddingTop: `${state.paddingY}px`,
              paddingBottom: `${state.paddingY}px`,
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
            }}
          >
            <Carousel<AssetDTO>
              items={assets}
              renderItem={renderItem}
              renderLoadingItem={renderLoadingItem}
              renderEmptyItem={renderEmptyItem}
              isLoading={isLoading}
              containScroll="trimSnaps"
              loadingCount={state.itemsPerView}
              itemsPerView={state.itemsPerView}
              gap={state.gap}
              orientation={state.orientation}
              rows={state.rows}
              columns={state.columns}
              navigation={{
                show: state.navStyle !== "none",
                position:
                  state.navStyle === "none" ? "default" : state.navStyle,
              }}
              dots={{
                show: state.dotsPosition !== "none",
                position:
                  state.dotsPosition === "none" ? "bottom" : state.dotsPosition,
              }}
              loop={state.loop}
              dragFree={state.dragFree}
              autoplay={{
                enabled: state.autoPlay,
                speed: state.autoPlaySpeed,
                stopOnInteraction: false,
                stopOnMouseEnter: state.autoPlayStopOnMouseEnter,
                resumeDelay: state.autoPlayResumeDelay,
              }}
              autoScroll={{
                enabled: state.autoScroll,
                interval: state.autoScrollInterval,
                speed: state.autoScrollSpeed,
                stopOnInteraction: false,
                stopOnMouseEnter: state.autoScrollStopOnMouseEnter,
              }}
              hasNextPage={hasNextPage}
              fetchNextPage={() => void fetchNextPage()}
              isFetchingNextPage={isFetchingNextPage}
              isError={isError}
              triggerOffset={3}
              rootMargin="200px"
              className="px-4"
            />
          </div>

          {/* Error State */}
          {isError && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-red-400">
                Failed to load carousel data. Please try again later.
              </p>
            </div>
          )}

          {/* Code Export Section */}
          <Collapsible open={state.showCode} onOpenChange={state.setShowCode}>
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Code Example</h3>
                  <p className="text-sm text-gray-400">
                    Complete implementation with your configuration
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="gap-2"
                  >
                    {state.copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {state.showCode ? "Hide" : "Show"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          state.showCode ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent className="mt-4">
                <pre className="overflow-x-auto rounded-md bg-black/50 p-4 text-xs">
                  <code className="text-gray-300">
                    {generateCarouselCode({
                      itemsPerView: state.itemsPerView,
                      gap: state.gap,
                      loop: state.loop,
                      dragFree: state.dragFree,
                      navStyle: state.navStyle,
                      dotsPosition: state.dotsPosition,
                      dataLimit: state.dataLimit,
                      orientation: state.orientation,
                      rows: state.rows,
                      columns: state.columns,
                      autoPlay: state.autoPlay,
                      autoPlaySpeed: state.autoPlaySpeed,
                      autoPlayStopOnMouseEnter: state.autoPlayStopOnMouseEnter,
                      autoPlayResumeDelay: state.autoPlayResumeDelay,
                      autoScroll: state.autoScroll,
                      autoScrollInterval: state.autoScrollInterval,
                      autoScrollSpeed: state.autoScrollSpeed,
                      autoScrollStopOnMouseEnter:
                        state.autoScrollStopOnMouseEnter,
                      maxWidth: state.maxWidth,
                      paddingY: state.paddingY,
                      bgColor: state.bgColor,
                      borderColor: state.borderColor,
                      showCode: state.showCode,
                      copied: state.copied,
                    })}
                  </code>
                </pre>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
