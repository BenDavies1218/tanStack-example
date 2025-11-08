"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import ClassNames from "embla-carousel-class-names";
import AutoScroll from "embla-carousel-auto-scroll";
import WheelGestures from "embla-carousel-wheel-gestures";
import type { AutoplayOptionsType } from "embla-carousel-autoplay";
import type { AutoScrollOptionsType } from "embla-carousel-auto-scroll";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { IntersectionObserver } from "@/app/_components/Generics/IntersectionObserver";
import { cn } from "@/lib/utils";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                       GENERIC CAROUSEL COMPONENT                          ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  A highly flexible, reusable carousel component built on shadcn/ui        ║
 * ║  with Embla carousel plugins for advanced functionality.                  ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Flexible data rendering with custom render functions                   ║
 * ║  • Configurable items per view (responsive layouts)                       ║
 * ║  • Multiple navigation styles (default, inside, outside)                  ║
 * ║  • Pagination dots with multiple positions                                ║
 * ║  • Loading state with skeleton support                                    ║
 * ║  • Empty state handling                                                   ║
 * ║  • Mouse drag and touch swipe support (built-in)                          ║
 * ║  • Mouse wheel and trackpad scrolling (enabled by default)                ║
 * ║  • Autoplay with configurable options                                     ║
 * ║  • Auto-scroll for infinite scrolling effect                              ║
 * ║  • Loop behavior and drag-free mode                                       ║
 * ║  • Orientation support (horizontal/vertical)                              ║
 * ║  • Slide change callbacks and API access                                  ║
 * ║                                                                           ║
 * ║  CAROUSEL STRUCTURE:                                                      ║
 * ║  ┌─────────────────────────────────────────────────────────────────┐      ║
 * ║  │ [Dots - Top Position] (optional)                                │      ║
 * ║  ├─────────────────────────────────────────────────────────────────┤      ║
 * ║  │ [← Previous Button]                                             │      ║
 * ║  │                                                                 │      ║
 * ║  │   ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐                  │      ║
 * ║  │   │ Item  │  │ Item  │  │ Item  │  │ Item  │                  │      ║
 * ║  │   │   1   │  │   2   │  │   3   │  │   4   │  (Carousel)      │      ║
 * ║  │   └───────┘  └───────┘  └───────┘  └───────┘                  │      ║
 * ║  │                                                                 │      ║
 * ║  │                                        [Next Button →]          │      ║
 * ║  ├─────────────────────────────────────────────────────────────────┤      ║
 * ║  │ [Dots - Bottom Position] (optional)                             │      ║
 * ║  └─────────────────────────────────────────────────────────────────┘      ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Navigation configuration for carousel buttons
 */
export interface NavigationConfig {
  /** Show previous/next navigation buttons */
  show?: boolean;
  /** Button positioning: "default", "inside", or "outside" */
  position?: "default" | "inside" | "outside";
  /** Additional CSS classes for navigation buttons */
  className?: string;
}

/**
 * Pagination dots configuration
 */
export interface DotsConfig {
  /** Show pagination dots */
  show?: boolean;
  /** Dots positioning: "top", "bottom", "inside", or "outside" */
  position?: "top" | "bottom" | "inside" | "outside";
  /** Additional CSS classes for dots container */
  className?: string;
}

/**
 * Autoplay configuration for continuous scrolling effect
 */
export interface AutoplayConfig {
  /** Enable autoplay */
  enabled?: boolean;
  /**
   * Scroll speed in pixels per frame
   * - Positive = forward, Negative = backward
   * @default 1
   */
  speed?: number;
  /** Stop scrolling when user interacts */
  stopOnInteraction?: boolean;
  /** Pause scrolling when mouse enters */
  stopOnMouseEnter?: boolean;
  /**
   * Delay in milliseconds before resuming after mouse leaves
   * @default 0
   */
  resumeDelay?: number;
  /** Advanced options (overrides speed settings if provided) */
  options?: Partial<AutoScrollOptionsType>;
}

/**
 * Auto-scroll configuration for automatic slide progression
 */
export interface AutoScrollConfig {
  /** Enable auto-scroll */
  enabled?: boolean;
  /**
   * Interval between auto-scrolls in milliseconds
   * This is the time the carousel waits before advancing to the next slide
   * @default 3000 (3 seconds)
   * @example interval={5000} - Wait 5 seconds between slides
   */
  interval?: number;
  /**
   * Duration of the scroll animation in milliseconds
   * This controls how fast the scroll transition happens
   * Note: This is passed to Embla's animation duration, not the Autoplay plugin
   * @default undefined (uses Embla's default animation duration)
   * @example speed={300} - 300ms scroll animation
   */
  speed?: number;
  /** Stop auto-scroll when user interacts with carousel */
  stopOnInteraction?: boolean;
  /** Pause auto-scroll when mouse enters carousel */
  stopOnMouseEnter?: boolean;
  /** Advanced options (overrides interval if 'delay' is provided) */
  options?: Partial<AutoplayOptionsType>;
}

/**
 * Wheel gestures configuration for mouse wheel and trackpad scrolling
 */
export interface WheelGesturesConfig {
  /** Enable wheel/trackpad scrolling */
  enabled?: boolean;
  /**
   * Force wheel axis (overrides detected axis)
   * - "x": Horizontal scrolling only
   * - "y": Vertical scrolling only (for vertical carousels)
   * - undefined: Auto-detect based on carousel orientation
   */
  forceWheelAxis?: "x" | "y";
  /** Advanced options (any additional WheelGestures plugin options) */
  options?: Record<string, unknown>;
}

/**
 * CarouselProps<T>
 *
 * Generic carousel component props with one type parameter:
 * @template T - The data type for each carousel item (e.g., Product, Image, Card)
 *
 * @example
 * // Simple carousel with products
 * <Carousel<Product>
 *   items={products}
 *   renderItem={(product) => <ProductCard product={product} />}
 *   itemsPerView={3}
 *   navigation={{ show: true }}
 * />
 *
 * @example
 * // Banner carousel with autoplay (continuous scrolling)
 * <Carousel<ImageData>
 *   items={images}
 *   renderItem={(image) => <img src={image.url} alt={image.title} />}
 *   autoplay={{ enabled: true, speed: 1, stopOnMouseEnter: true, resumeDelay: 1000 }}
 *   dots={{ show: true, position: "inside" }}
 * />
 *
 * @example
 * // Carousel with auto-scroll (slide progression)
 * <Carousel<AssetDTO>
 *   items={assets}
 *   renderItem={(asset) => <AssetCard asset={asset} />}
 *   itemsPerView="auto"
 *   autoScroll={{ enabled: true, interval: 3000, speed: 300 }}
 * />
 */
export interface CarouselProps<T> {
  // ============================================================================
  // DATA & RENDERING
  // ============================================================================

  /** Array of data items to display in the carousel */
  items: T[];

  /**
   * Function to render each carousel item
   * @param item - The data item for this carousel slide
   * @param index - The index of this item in the items array
   */
  renderItem: (item: T, index: number) => ReactNode;

  /**
   * Function to render loading skeleton items
   * Called for each loadingCount during initial load
   */
  renderLoadingItem?: () => ReactNode;

  /**
   * Function to render empty state when no items are available
   * Only shown when not loading and items array is empty
   */
  renderEmptyItem?: () => ReactNode;

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  /** Loading state - shows skeleton items when true */
  isLoading?: boolean;

  /** Number of skeleton items to show during loading state */
  loadingCount?: number;

  // ============================================================================
  // LAYOUT & STYLING
  // ============================================================================

  /**
   * Number of items visible at once, or "auto" for responsive sizing
   * @default "auto"
   * @example itemsPerView={3} - Show 3 items at once
   * @example itemsPerView="auto" - Let items determine their own width
   */
  itemsPerView?: number | "auto";

  /**
   * Gap between carousel items in pixels
   * @default 16
   */
  gap?: number;

  /**
   * Carousel scroll direction
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Number of rows for horizontal carousels (stacks items vertically)
   * @default 1
   * @example rows={2} - Shows 2 rows of items in horizontal carousel
   */
  rows?: number;

  /**
   * Number of columns for vertical carousels (stacks items horizontally)
   * @default 1
   * @example columns={2} - Shows 2 columns of items in vertical carousel
   */
  columns?: number;

  /** Additional CSS classes for the carousel container */
  className?: string;

  /** Additional CSS classes for each carousel item */
  itemClassName?: string;

  // ============================================================================
  // NAVIGATION & PAGINATION
  // ============================================================================

  /**
   * Navigation buttons configuration
   * @example navigation={{ show: true, position: "inside" }}
   */
  navigation?: NavigationConfig;

  /**
   * Pagination dots configuration
   * @example dots={{ show: true, position: "bottom" }}
   */
  dots?: DotsConfig;

  // ============================================================================
  // EMBLA CAROUSEL OPTIONS
  // ============================================================================

  /**
   * Enable infinite loop scrolling
   * @default false
   */
  loop?: boolean;

  /**
   * Skip snap positions that don't align with items
   * @default false
   */
  skipSnaps?: boolean;

  /**
   * Item alignment within viewport
   * @default "start"
   */
  align?: "start" | "center" | "end";

  /**
   * Enable free dragging (scrolls pixel by pixel, not snap to items)
   * @default true
   */
  dragFree?: boolean;

  /**
   * Scroll containment behavior
   * - "trimSnaps": Remove snap points that would scroll past bounds
   * - "keepSnaps": Keep all snap points (may show empty space)
   * - false: No containment
   * @default "trimSnaps"
   */
  containScroll?: "trimSnaps" | "keepSnaps" | false;

  // ============================================================================
  // PLUGINS
  // ============================================================================

  /**
   * Autoplay configuration for continuous scrolling (banner/ticker effect)
   * @example autoplay={{ enabled: true, speed: 1, stopOnMouseEnter: true, resumeDelay: 1000 }}
   */
  autoplay?: AutoplayConfig;

  /**
   * Auto-scroll configuration for automatic slide progression
   * @example autoScroll={{ enabled: true, interval: 3000, speed: 300 }}
   */
  autoScroll?: AutoScrollConfig;

  /**
   * Wheel gestures configuration for mouse wheel and trackpad scrolling
   * Enables scrolling through carousel items using mouse wheel or trackpad
   * @default { enabled: true }
   * @example wheelGestures={{ enabled: true, forceWheelAxis: "x" }}
   */
  wheelGestures?: WheelGesturesConfig;

  /**
   * Enable CSS class names plugin for styling active/inactive slides
   * @default true
   */
  useClassNames?: boolean;

  // ============================================================================
  // CALLBACKS
  // ============================================================================

  /**
   * Callback fired when active slide changes
   * @param index - The new active slide index
   */
  onSlideChange?: (index: number) => void;

  /**
   * Callback fired when carousel API is ready
   * Provides access to Embla carousel API for advanced control
   * @param api - The Embla carousel API instance
   */
  onApiReady?: (api: CarouselApi) => void;

  // ============================================================================
  // INFINITE LOADING
  // ============================================================================

  /**
   * Whether there are more pages to fetch for infinite loading
   * @default false
   */
  hasNextPage?: boolean;

  /**
   * Callback to fetch the next page of data
   * Called when IntersectionObserver detects trigger element
   */
  fetchNextPage?: () => void;

  /**
   * Whether a page fetch is currently in progress
   * @default false
   */
  isFetchingNextPage?: boolean;

  /**
   * Whether an error occurred during data fetching
   * @default false
   */
  isError?: boolean;

  /**
   * Number of items from the end to place the IntersectionObserver trigger
   * Lower values trigger earlier (fetch sooner)
   * @default 3
   * @example triggerOffset={5} - Trigger when 5 items from end
   */
  triggerOffset?: number;

  /**
   * Root margin for IntersectionObserver (triggers earlier/later)
   * @default "200px"
   * @example rootMargin="400px" - Trigger 400px before element visible
   */
  rootMargin?: string;

  // ============================================================================
  // MISC
  // ============================================================================

  /** Additional children to render (rare use case) */
  children?: ReactNode;
}

// ============================================================================
// Navigation Buttons Component
// ============================================================================

/**
 * CarouselNavigation
 *
 * Renders the previous/next navigation buttons with configurable positioning
 * Used internally by the Carousel component
 */
interface CarouselNavigationProps {
  navigationPosition: "default" | "inside" | "outside";
  navigationClassName?: string;
}

function CarouselNavigation({
  navigationPosition,
  navigationClassName,
}: CarouselNavigationProps) {
  return (
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
  );
}

// ============================================================================
// Pagination Dots Component
// ============================================================================

/**
 * CarouselDots
 *
 * Renders pagination dots with click handlers for direct navigation
 * Used internally by the Carousel component
 */
interface CarouselDotsProps {
  count: number;
  current: number;
  api?: CarouselApi;
  dotsPosition: "top" | "bottom" | "inside" | "outside";
  dotsClassName?: string;
}

function CarouselDots({
  count,
  current,
  api,
  dotsPosition,
  dotsClassName,
}: CarouselDotsProps) {
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
}

// ============================================================================
// Main Carousel Component
// ============================================================================

/**
 * Carousel<T>
 *
 * A fully-featured carousel component with extensive customization options.
 *
 * FLOW DIAGRAM:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 1. INITIAL LOAD (isLoading = true)                                  │
 * │    → Shows loadingCount skeleton items                              │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 2. DATA LOADED (items.length > 0)                                   │
 * │    → Renders actual carousel items                                  │
 * │    → Initializes Embla carousel API                                 │
 * │    → Sets up plugins (autoplay, auto-scroll, class names)           │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 3. USER INTERACTION                                                 │
 * │    → Click navigation buttons to change slides                      │
 * │    → Click dots to jump to specific slide                           │
 * │    → Drag to scroll (if not dragFree, snaps to items)               │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 4. SLIDE CHANGES                                                    │
 * │    → Updates current slide index                                    │
 * │    → Calls onSlideChange callback                                   │
 * │    → Updates active dot indicator                                   │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 5. AUTOPLAY/AUTO-SCROLL (if enabled)                                │
 * │    → Automatically progresses slides at interval                    │
 * │    → Stops on user interaction (configurable)                       │
 * │    → Resumes after delay (configurable)                             │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * EMPTY STATE HANDLING:
 * • isLoading = false && items.length === 0 → Shows empty state
 * • Prevents rendering carousel structure when no data
 *
 * PLUGIN SYSTEM:
 * • ClassNames: Adds CSS classes to active/inactive slides for styling
 * • Autoplay: Automatic slide progression with configurable timing
 * • AutoScroll: Continuous smooth scrolling for infinite effect
 *
 * @template T - Carousel item data type
 */
export function Carousel<T>({
  items,
  renderItem,
  renderLoadingItem,
  renderEmptyItem,
  isLoading = false,
  loadingCount = 4,
  itemsPerView = "auto",
  gap = 16,
  orientation = "horizontal",
  rows = 1,
  columns = 1,
  className,
  itemClassName,
  navigation,
  dots,
  loop = false,
  skipSnaps = false,
  align = "start",
  dragFree = true,
  containScroll = "trimSnaps",
  autoplay,
  autoScroll,
  wheelGestures,
  useClassNames = true,
  onSlideChange,
  onApiReady,
  hasNextPage = false,
  fetchNextPage,
  isFetchingNextPage = false,
  isError = false,
  triggerOffset = 3,
  rootMargin = "200px",
  children,
}: CarouselProps<T>) {
  // ============================================================================
  // CONFIG DESTRUCTURING WITH DEFAULTS
  // ============================================================================

  const {
    show: showNavigation = true,
    position: navigationPosition = "default",
    className: navigationClassName,
  } = navigation ?? {};

  const {
    show: showDots = false,
    position: dotsPosition = "bottom",
    className: dotsClassName,
  } = dots ?? {};

  const {
    enabled: autoplayEnabled = false,
    speed: autoplaySpeed = 1,
    stopOnInteraction: autoplayStopOnInteraction = true,
    stopOnMouseEnter: autoplayStopOnMouseEnter = true,
    resumeDelay: autoplayResumeDelay = 0,
    options: autoplayOptions,
  } = autoplay ?? {};

  const {
    enabled: autoScrollEnabled = false,
    interval: autoScrollInterval = 3000,
    speed: autoScrollSpeed,
    stopOnInteraction: autoScrollStopOnInteraction = true,
    stopOnMouseEnter: autoScrollStopOnMouseEnter = true,
    options: autoScrollOptions,
  } = autoScroll ?? {};

  const {
    enabled: wheelGesturesEnabled = true, // Enabled by default
    forceWheelAxis: wheelGesturesForceAxis,
    options: wheelGesturesOptions,
  } = wheelGestures ?? {};
  // ============================================================================
  // STATE
  // ============================================================================

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const previousItemCount = useRef(items.length);

  // ============================================================================
  // EMPTY STATE
  // ============================================================================

  const isEmpty = !isLoading && items.length === 0;

  // ============================================================================
  // EMBLA PLUGINS
  // ============================================================================

  const plugins = useMemo(() => {
    const pluginArray = [];

    if (useClassNames) {
      pluginArray.push(ClassNames());
    }

    if (wheelGesturesEnabled) {
      const wheelConfig: Partial<Record<string, unknown>> = {
        forceWheelAxis: wheelGesturesForceAxis,
        ...(wheelGesturesOptions ?? {}),
      };
      pluginArray.push(WheelGestures(wheelConfig));
    }

    if (autoplayEnabled) {
      pluginArray.push(
        AutoScroll({
          speed: autoplaySpeed,
          stopOnInteraction: autoplayStopOnInteraction,
          stopOnMouseEnter: autoplayStopOnMouseEnter,
          startDelay: autoplayResumeDelay,
          ...autoplayOptions, // Allow override if needed
        }),
      );
    }

    if (autoScrollEnabled) {
      pluginArray.push(
        Autoplay({
          delay: autoScrollInterval,
          stopOnInteraction: autoScrollStopOnInteraction,
          stopOnMouseEnter: autoScrollStopOnMouseEnter,
          ...autoScrollOptions, // Allow override if needed (e.g., custom delay)
        }),
      );
    }

    return pluginArray;
  }, [
    wheelGesturesEnabled,
    wheelGesturesForceAxis,
    wheelGesturesOptions,
    autoplayEnabled,
    autoplaySpeed,
    autoplayStopOnInteraction,
    autoplayStopOnMouseEnter,
    autoplayResumeDelay,
    autoplayOptions,
    autoScrollEnabled,
    autoScrollInterval,
    autoScrollStopOnInteraction,
    autoScrollStopOnMouseEnter,
    autoScrollOptions,
    useClassNames,
  ]);

  // ============================================================================
  // EMBLA OPTIONS
  // ============================================================================

  const opts = useMemo(
    () => ({
      align,
      loop,
      skipSnaps,
      dragFree,
      containScroll,
      slidesToScroll: typeof itemsPerView === "number" ? itemsPerView : 1,
      // Set scroll animation duration if autoScroll is enabled with a speed value
      ...(autoScrollEnabled && autoScrollSpeed !== undefined
        ? { duration: autoScrollSpeed }
        : {}),
    }),
    [
      align,
      loop,
      skipSnaps,
      dragFree,
      containScroll,
      itemsPerView,
      autoScrollEnabled,
      autoScrollSpeed,
    ],
  );

  // ============================================================================
  // CAROUSEL API & SLIDE CHANGE HANDLING
  // ============================================================================

  useEffect(() => {
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

  // ============================================================================
  // PRESERVE SCROLL POSITION DURING INFINITE LOADING
  // ============================================================================

  // Capture scroll position when items change (for infinite loading)
  useEffect(() => {
    if (!api) return;

    // Only proceed if items were added (not removed or initial load)
    if (items.length <= previousItemCount.current) {
      previousItemCount.current = items.length;
      return;
    }

    // Capture current scroll position BEFORE React re-renders
    const container = api.containerNode();
    const scrollContainer = api.rootNode();

    if (!container || !scrollContainer) {
      previousItemCount.current = items.length;
      return;
    }

    // Store the current absolute scroll offset in pixels
    const currentScrollLeft = scrollContainer.scrollLeft;
    const currentScrollTop = scrollContainer.scrollTop;

    // Wait for DOM to update with new items
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!api) return;

        // Reinitialize Embla to recalculate with new items
        api.reInit();

        // Restore the exact pixel position
        // This prevents any visible jump because we're setting it before paint
        if (orientation === "horizontal") {
          scrollContainer.scrollLeft = currentScrollLeft;
        } else {
          scrollContainer.scrollTop = currentScrollTop;
        }
      });
    });

    previousItemCount.current = items.length;
  }, [api, items.length, orientation]);

  // ============================================================================
  // INFINITE LOADING HANDLER
  // ============================================================================

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage || isError) return;
    fetchNextPage?.();
  };

  // ============================================================================
  // ITEM LAYOUT CALCULATIONS
  // ============================================================================

  // Determine if we're using multi-row/column layout
  const isMultiRow = orientation === "horizontal" && rows > 1;
  const isMultiColumn = orientation === "vertical" && columns > 1;
  const isMultiLayout = isMultiRow || isMultiColumn;
  const layoutCount = isMultiRow ? rows : columns;

  // Chunk items into slides for multi-row/column layouts
  const chunkedItems = useMemo(() => {
    if (!isMultiLayout) return items.map((item) => [item]);

    const itemsPerSlide =
      typeof itemsPerView === "number"
        ? itemsPerView * layoutCount
        : layoutCount;
    const chunks: T[][] = [];

    for (let i = 0; i < items.length; i += itemsPerSlide) {
      chunks.push(items.slice(i, i + itemsPerSlide));
    }

    return chunks;
  }, [items, isMultiLayout, itemsPerView, layoutCount]);

  const itemBasis =
    typeof itemsPerView === "number" && itemsPerView > 0
      ? `calc(${100 / itemsPerView}% - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`
      : "auto";

  const itemStyle =
    typeof itemsPerView === "number"
      ? { flexBasis: itemBasis, minWidth: itemBasis }
      : undefined;

  // For itemsPerView="auto", override the default basis-full from CarouselItem
  const autoItemClassName = itemsPerView === "auto" ? "basis-auto" : "";

  // ============================================================================
  // EMPTY STATE RENDERING
  // ============================================================================

  if (isEmpty && renderEmptyItem) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {renderEmptyItem()}
      </div>
    );
  }

  // ============================================================================
  // MAIN CAROUSEL RENDERING
  // ============================================================================

  return (
    <div className={cn("relative", className)}>
      {/* Top pagination dots */}
      {showDots && dotsPosition === "top" && (
        <CarouselDots
          count={count}
          current={current}
          api={api}
          dotsPosition={dotsPosition}
          dotsClassName={dotsClassName}
        />
      )}

      {/* Main carousel */}
      <ShadcnCarousel
        opts={opts}
        plugins={plugins}
        orientation={orientation}
        setApi={setApi}
        className={navigationPosition === "inside" ? "px-12" : undefined}
      >
        <CarouselContent style={{ gap: `${gap}px` }}>
          {/* Loading skeleton items */}
          {isLoading &&
            Array.from({ length: loadingCount }).map((_, index) => (
              <CarouselItem
                key={`loading-${index}`}
                className={cn(autoItemClassName, itemClassName)}
                style={itemStyle}
              >
                {renderLoadingItem?.()}
              </CarouselItem>
            ))}

          {/* Actual data items */}
          {!isLoading &&
            chunkedItems.map((chunk, slideIndex) => {
              const isNearEnd =
                slideIndex === chunkedItems.length - triggerOffset;
              const shouldShowTrigger =
                isNearEnd &&
                hasNextPage &&
                !isFetchingNextPage &&
                !isError &&
                fetchNextPage !== undefined;

              return (
                <>
                  <CarouselItem
                    key={slideIndex}
                    className={cn(autoItemClassName, itemClassName)}
                    style={itemStyle}
                  >
                    {isMultiLayout ? (
                      /* Multi-row/column layout using CSS Grid */
                      <div
                        className="grid h-full w-full"
                        style={{
                          gridTemplateRows: isMultiRow
                            ? `repeat(${rows}, 1fr)`
                            : undefined,
                          gridTemplateColumns: isMultiColumn
                            ? `repeat(${columns}, 1fr)`
                            : isMultiRow && typeof itemsPerView === "number"
                              ? `repeat(${itemsPerView}, 1fr)`
                              : undefined,
                          gap: `${gap}px`,
                        }}
                      >
                        {chunk.map((item, itemIndex) => {
                          const originalIndex =
                            slideIndex * chunk.length + itemIndex;
                          return (
                            <div key={itemIndex} className="h-full w-full">
                              {renderItem(item, originalIndex)}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Single item per slide */
                      renderItem(chunk[0]!, slideIndex)
                    )}
                  </CarouselItem>
                  {/* IntersectionObserver trigger item */}
                  {shouldShowTrigger && (
                    <CarouselItem
                      key={`trigger-${slideIndex}`}
                      className="w-0 shrink-0 p-0"
                    >
                      <IntersectionObserver
                        onIntersect={handleLoadMore}
                        enabled={!isFetchingNextPage && !isError}
                        rootMargin={rootMargin}
                        className="h-full w-px"
                      />
                    </CarouselItem>
                  )}
                </>
              );
            })}
        </CarouselContent>

        {/* Navigation buttons */}
        {showNavigation && !isLoading && !isEmpty && (
          <CarouselNavigation
            navigationPosition={navigationPosition}
            navigationClassName={navigationClassName}
          />
        )}
      </ShadcnCarousel>

      {/* Bottom/inside pagination dots */}
      {showDots &&
        (dotsPosition === "bottom" || dotsPosition === "inside") &&
        !isLoading &&
        !isEmpty && (
          <CarouselDots
            count={count}
            current={current}
            api={api}
            dotsPosition={dotsPosition}
            dotsClassName={dotsClassName}
          />
        )}

      {/* Additional children (rare use case) */}
      {children}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export types for consumers
export type { CarouselApi };
export default Carousel;
