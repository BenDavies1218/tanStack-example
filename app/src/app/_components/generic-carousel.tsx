"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import ClassNames from "embla-carousel-class-names";
import AutoScroll from "embla-carousel-auto-scroll";
import type { AutoplayOptionsType } from "embla-carousel-autoplay";
import type { AutoScrollOptionsType } from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/**
 * Custom Carousel Component API
 *
 * A flexible carousel wrapper built on shadcn/ui carousel with embla plugins
 */

export interface GenericCarouselProps<T> {
  // Data
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;

  // Layout
  itemsPerView?: number | "auto";
  gap?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  itemClassName?: string;

  // Navigation
  showNavigation?: boolean;
  navigationPosition?: "default" | "inside" | "outside";
  navigationClassName?: string;

  // Dots/Pagination
  showDots?: boolean;
  dotsPosition?: "bottom" | "top" | "inside" | "outside";
  dotsClassName?: string;

  // Loop behavior
  loop?: boolean;
  skipSnaps?: boolean;

  // Autoplay plugin
  autoplay?: boolean;
  autoplayOptions?: Partial<AutoplayOptionsType>;

  // Auto-scroll plugin
  autoScroll?: boolean;
  autoScrollOptions?: Partial<AutoScrollOptionsType>;

  // Class names plugin (enabled by default)
  useClassNames?: boolean;

  // Alignment
  align?: "start" | "center" | "end";

  // Drag behavior
  dragFree?: boolean;
  containScroll?: "trimSnaps" | "keepSnaps" | false;

  // Events
  onSlideChange?: (index: number) => void;
  onApiReady?: (api: CarouselApi) => void;
}

export function GenericCarousel<T>({
  items,
  renderItem,
  itemsPerView = 1,
  gap = 16,
  orientation = "horizontal",
  className,
  itemClassName,
  showNavigation = true,
  navigationPosition = "default",
  navigationClassName,
  showDots = false,
  dotsPosition = "bottom",
  dotsClassName,
  loop = false,
  skipSnaps = false,
  autoplay = false,
  autoplayOptions,
  autoScroll = false,
  autoScrollOptions,
  useClassNames = true,
  align = "start",
  dragFree = false,
  containScroll = "trimSnaps",
  onSlideChange,
  onApiReady,
}: GenericCarouselProps<T>) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Build embla plugins array
  const plugins = React.useMemo(() => {
    const pluginArray = [];

    if (useClassNames) {
      pluginArray.push(ClassNames());
    }

    if (autoplay) {
      pluginArray.push(
        Autoplay({
          delay: 3000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
          ...autoplayOptions,
        }),
      );
    }

    if (autoScroll) {
      pluginArray.push(
        AutoScroll({
          speed: 1,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
          ...autoScrollOptions,
        }),
      );
    }

    return pluginArray;
  }, [autoplay, autoplayOptions, autoScroll, autoScrollOptions, useClassNames]);

  // Build embla options
  const opts = React.useMemo(
    () => ({
      align,
      loop,
      skipSnaps,
      dragFree,
      containScroll,
      slidesToScroll: typeof itemsPerView === "number" ? itemsPerView : 1,
    }),
    [align, loop, skipSnaps, dragFree, containScroll, itemsPerView],
  );

  // Handle API ready and slide changes
  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    onApiReady?.(api);

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrent(index);
      onSlideChange?.(index);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onSlideChange, onApiReady]);

  // Calculate item width based on itemsPerView
  const itemBasis =
    typeof itemsPerView === "number" && itemsPerView > 0
      ? `calc(${100 / itemsPerView}% - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`
      : "auto";

  const itemStyle =
    typeof itemsPerView === "number"
      ? { flexBasis: itemBasis, minWidth: itemBasis }
      : undefined;

  const renderDots = () => {
    if (!showDots) return null;

    return (
      <div
        className={cn(
          "flex justify-center gap-2 py-4",
          dotsPosition === "inside" && "absolute right-0 bottom-4 left-0 z-10",
          dotsClassName,
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              current === index
                ? "bg-primary w-4"
                : "bg-primary/30 hover:bg-primary/50",
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {showDots && dotsPosition === "top" && renderDots()}

      <Carousel
        opts={opts}
        plugins={plugins}
        orientation={orientation}
        setApi={setApi}
        className={navigationPosition === "inside" ? "px-12" : undefined}
      >
        <CarouselContent style={{ gap: `${gap}px` }}>
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className={cn(itemClassName)}
              style={itemStyle}
            >
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {showNavigation && (
          <>
            <CarouselPrevious
              className={cn(
                navigationPosition === "inside" && "left-4",
                navigationPosition === "outside" && "-left-12",
                navigationClassName,
              )}
            />
            <CarouselNext
              className={cn(
                navigationPosition === "inside" && "right-4",
                navigationPosition === "outside" && "-right-12",
                navigationClassName,
              )}
            />
          </>
        )}
      </Carousel>

      {showDots &&
        (dotsPosition === "bottom" || dotsPosition === "inside") &&
        renderDots()}
    </div>
  );
}

// Export types for consumers
export type { CarouselApi };
