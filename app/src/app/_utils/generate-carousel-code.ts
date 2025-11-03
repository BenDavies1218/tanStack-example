import type { SandboxCarouselState } from "@/app/_hooks/use-sandbox-carousel-state";

export function generateCarouselCode(state: SandboxCarouselState): string {
  const navConfig =
    state.navStyle !== "none"
      ? `navigation={{ show: true, position: "${state.navStyle}" }}`
      : "navigation={{ show: false }}";

  const dotsConfig =
    state.dotsPosition !== "none"
      ? `dots={{ show: true, position: "${state.dotsPosition}" }}`
      : "dots={{ show: false }}";

  const orientationConfig = state.orientation !== "horizontal"
    ? `orientation="${state.orientation}"`
    : "";

  const autoplayConfig = state.autoPlay
    ? `autoplay={{
          enabled: true,
          speed: ${state.autoPlaySpeed},
          stopOnInteraction: false,
          stopOnMouseEnter: ${state.autoPlayStopOnMouseEnter},
          resumeDelay: ${state.autoPlayResumeDelay},
        }}`
    : "";

  const autoScrollConfig = state.autoScroll
    ? `autoScroll={{
          enabled: true,
          speed: ${state.autoScrollSpeed},
          limit: ${state.autoScrollLimit},
          stopOnInteraction: false,
          stopOnMouseEnter: ${state.autoScrollStopOnMouseEnter},
        }}`
    : "";

  return `"use client";

import { api } from "@/trpc/react";
import { Carousel } from "@/app/_components/generic-carousel";
import { toast } from "sonner";
import type { AssetDTO } from "@/types/asset";

const renderItem = (asset: AssetDTO) => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
    <div className="mb-4 flex items-center gap-4">
      <img
        src={asset.image}
        alt={asset.name}
        className="h-12 w-12 rounded-full"
      />
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-lg font-semibold">{asset.name}</h3>
        <p className="text-sm text-gray-400">
          {asset.symbol.toUpperCase()} • Rank #{asset.rank}
        </p>
      </div>
    </div>
    <div className="mb-4 space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold">
          \${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
        <span
          className={\`text-sm font-medium \${
            asset["24hChange"] >= 0 ? "text-green-400" : "text-red-400"
          }\`}
        >
          {asset["24hChange"] >= 0 ? "+" : ""}
          {asset["24hChange"].toFixed(2)}%
        </span>
      </div>
    </div>
    <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Market Cap</span>
        <span className="font-medium">
          \${(asset.marketCap / 1e9).toFixed(2)}B
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Volume (24h)</span>
        <span className="font-medium">
          \${(asset.totalVolume / 1e9).toFixed(2)}B
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Category</span>
        <span className="font-medium">{asset.category}</span>
      </div>
    </div>
  </div>
);

export default function CustomCarousel() {
  const { data, isLoading } = api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
    {
      limit: ${state.dataLimit},
      sortBy: "rank",
      sortOrder: "asc"
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      throwOnError: () => {
        toast.error("Failed to fetch carousel data");
        return false;
      }
    }
  );

  const assets: AssetDTO[] = data?.pages[0]?.items ?? [];

  return (
    <div
      className="flex items-center justify-center rounded-lg"
      style={{
        maxWidth: "${state.maxWidth}px",
        margin: "0 auto",
        backgroundColor: "${state.bgColor}",
        borderColor: "${state.borderColor}",
        borderWidth: "2px",
        borderStyle: "solid",
        paddingTop: "${state.paddingY}px",
        paddingBottom: "${state.paddingY}px",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem"
      }}
    >
      <Carousel<AssetDTO>
        items={assets}
        renderItem={renderItem}
        isLoading={isLoading}
        itemsPerView={${state.itemsPerView}}
        gap={${state.gap}}
        loop={${state.loop}}
        dragFree={${state.dragFree}}
        ${orientationConfig}
        ${state.rows > 1 ? `rows={${state.rows}}` : ""}
        ${state.columns > 1 ? `columns={${state.columns}}` : ""}
        ${navConfig}
        ${dotsConfig}
        ${autoplayConfig}
        ${autoScrollConfig}
        containScroll="trimSnaps"
        className="px-4"
      />
    </div>
  );
}

/*
 * Color Customization:
 * - Background: ${state.bgColor}
 * - Border: ${state.borderColor}
 *
 * Apply these colors to the container div as shown above.
 *
 * Carousel Configuration:
 * - Orientation: ${state.orientation}
 * - Rows (horizontal): ${state.rows}
 * - Columns (vertical): ${state.columns}
 *
 * Note: For multi-row/column layouts, you may need to adjust the carousel
 * container height and use CSS Grid or Flexbox wrapping for the items.
 * The generic Carousel component handles the basic orientation, but
 * rows/columns require additional styling on the container.
 *
 * Advanced Features Configuration:
 *
 * Auto Play (Continuous Scrolling): ${state.autoPlay ? "ENABLED" : "DISABLED"}
 ${
   state.autoPlay
     ? `* - Speed: ${state.autoPlaySpeed}px per frame
 * - Stop on Mouse Enter: ${state.autoPlayStopOnMouseEnter}
 * - Resume Delay: ${state.autoPlayResumeDelay}ms`
     : ""
 }
 *
 * Auto Scroll (Slide Progression): ${state.autoScroll ? "ENABLED" : "DISABLED"}
 ${
   state.autoScroll
     ? `* - Speed: ${state.autoScrollSpeed}x
 * - Interval: ${state.autoScrollLimit}s
 * - Stop on Mouse Enter: ${state.autoScrollStopOnMouseEnter}`
     : ""
 }
 *
 * Note: The generic Carousel component uses Embla plugins:
 * - autoplay prop: Uses AutoScroll plugin for continuous scrolling
 * - autoScroll prop: Uses Autoplay plugin for slide progression
 * Refer to the Carousel component documentation for implementation details.
 */`;
}
