"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

/**
 * Custom hook for controlling and extending carousel functionality
 *
 * Provides methods for navigation, state tracking, autoplay control,
 * keyboard shortcuts, and more.
 */

export interface UseCarouselControllerOptions {
  // Initial slide index
  initialSlide?: number;

  // Enable keyboard navigation
  enableKeyboard?: boolean;

  // Custom keyboard shortcuts
  keyboardShortcuts?: {
    prev?: string[];
    next?: string[];
    first?: string[];
    last?: string[];
    play?: string[];
    pause?: string[];
  };

  // Auto-advance after delay (ms)
  autoAdvanceDelay?: number;

  // Callbacks
  onSlideChange?: (index: number) => void;
  onReachStart?: () => void;
  onReachEnd?: () => void;
  onAutoplayStart?: () => void;
  onAutoplayStop?: () => void;
}

export interface UseCarouselControllerReturn {
  // Carousel API ref
  api: CarouselApi | undefined;
  setApi: (api: CarouselApi | undefined) => void;

  // Current state
  currentSlide: number;
  slideCount: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isPlaying: boolean;
  selectedSnapDisplay: string; // e.g., "3 / 10"

  // Navigation methods
  goToSlide: (index: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  goToFirst: () => void;
  goToLast: () => void;

  // Autoplay controls
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;

  // Utility methods
  getSlideProgress: () => number; // 0-100 percentage
  isSlideActive: (index: number) => boolean;
  getVisibleSlides: () => number[];

  // Advanced controls
  scrollTo: (index: number, jump?: boolean) => void;

  // Thumbnail navigation helper
  thumbnailScrollTo: (index: number) => void;
}

export function useCarouselController(
  options: UseCarouselControllerOptions = {},
): UseCarouselControllerReturn {
  const {
    initialSlide = 0,
    enableKeyboard = false,
    keyboardShortcuts = {
      prev: ["ArrowLeft"],
      next: ["ArrowRight"],
      first: ["Home"],
      last: ["End"],
      play: [" ", "p"],
      pause: ["Escape"],
    },
    autoAdvanceDelay,
    onSlideChange,
    onReachStart,
    onReachEnd,
    onAutoplayStart,
    onAutoplayStop,
  } = options;

  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [slideCount, setSlideCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize carousel state
  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCurrentSlide(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateState();

    api.on("select", updateState);
    api.on("reInit", updateState);

    return () => {
      api.off("select", updateState);
      api.off("reInit", updateState);
    };
  }, [api]);

  // Handle slide change callbacks
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      onSlideChange?.(index);

      if (index === 0) {
        onReachStart?.();
      }
      if (index === api.scrollSnapList().length - 1) {
        onReachEnd?.();
      }
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onSlideChange, onReachStart, onReachEnd]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard || !api) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (keyboardShortcuts.prev?.includes(key)) {
        event.preventDefault();
        goToPrev();
      } else if (keyboardShortcuts.next?.includes(key)) {
        event.preventDefault();
        goToNext();
      } else if (keyboardShortcuts.first?.includes(key)) {
        event.preventDefault();
        goToFirst();
      } else if (keyboardShortcuts.last?.includes(key)) {
        event.preventDefault();
        goToLast();
      } else if (keyboardShortcuts.play?.includes(key)) {
        event.preventDefault();
        play();
      } else if (keyboardShortcuts.pause?.includes(key)) {
        event.preventDefault();
        pause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- IGNORE ---
  }, [enableKeyboard, api, keyboardShortcuts]);

  // Auto-advance functionality
  useEffect(() => {
    if (!api || !autoAdvanceDelay || !isPlaying) {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
      return;
    }

    autoAdvanceTimer.current = setTimeout(() => {
      if (canScrollNext) {
        goToNext();
      } else {
        goToFirst();
      }
    }, autoAdvanceDelay);

    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- IGNORE ---
  }, [api, autoAdvanceDelay, isPlaying, currentSlide, canScrollNext]);

  // Navigation methods
  const goToSlide = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const goToNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const goToPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const goToFirst = useCallback(() => {
    api?.scrollTo(0);
  }, [api]);

  const goToLast = useCallback(() => {
    if (api) {
      api.scrollTo(api.scrollSnapList().length - 1);
    }
  }, [api]);

  // Autoplay controls
  const play = useCallback(() => {
    setIsPlaying(true);
    onAutoplayStart?.();

    // If carousel has autoplay plugin, trigger it
    const autoplayPlugin = api?.plugins()?.autoplay;
    if (autoplayPlugin?.play) {
      autoplayPlugin.play();
    }
  }, [api, onAutoplayStart]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    onAutoplayStop?.();

    // If carousel has autoplay plugin, stop it
    const autoplayPlugin = api?.plugins()?.autoplay;
    if (autoplayPlugin?.stop) {
      autoplayPlugin.stop();
    }

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }
  }, [api, onAutoplayStop]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const reset = useCallback(() => {
    pause();
    goToFirst();
  }, [pause, goToFirst]);

  // Utility methods
  const getSlideProgress = useCallback((): number => {
    if (!api || slideCount === 0) return 0;
    return ((currentSlide + 1) / slideCount) * 100;
  }, [api, currentSlide, slideCount]);

  const isSlideActive = useCallback(
    (index: number): boolean => {
      return currentSlide === index;
    },
    [currentSlide],
  );

  const getVisibleSlides = useCallback((): number[] => {
    if (!api) return [];
    return api.slidesInView();
  }, [api]);

  const scrollTo = useCallback(
    (index: number, jump = false) => {
      api?.scrollTo(index, jump);
    },
    [api],
  );

  const thumbnailScrollTo = useCallback(
    (index: number) => {
      goToSlide(index);
    },
    [goToSlide],
  );

  const selectedSnapDisplay = `${currentSlide + 1} / ${slideCount}`;

  return {
    api,
    setApi,
    currentSlide,
    slideCount,
    canScrollPrev,
    canScrollNext,
    isPlaying,
    selectedSnapDisplay,
    goToSlide,
    goToNext,
    goToPrev,
    goToFirst,
    goToLast,
    play,
    pause,
    toggle,
    reset,
    getSlideProgress,
    isSlideActive,
    getVisibleSlides,
    scrollTo,
    thumbnailScrollTo,
  };
}
