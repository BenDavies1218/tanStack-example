import { useState } from "react";

export interface SandboxCarouselState {
  // Carousel Settings
  itemsPerView: number;
  gap: number;
  loop: boolean;
  dragFree: boolean;
  navStyle: "none" | "default" | "inside" | "outside";
  dotsPosition: "none" | "top" | "bottom";
  dataLimit: number;
  orientation: "horizontal" | "vertical";
  rows: number; // Number of rows for horizontal orientation (1-5)
  columns: number; // Number of columns for vertical orientation (1-5)

  // Advanced Features
  autoPlay: boolean; // Continuous scrolling
  autoPlaySpeed: number; // Speed in pixels per frame (1-5)
  autoPlayStopOnMouseEnter: boolean;
  autoPlayResumeDelay: number; // Delay in ms (0-3000)

  autoScroll: boolean; // Slide progression
  autoScrollInterval: number; // Interval between slides in milliseconds (1000-10000)
  autoScrollSpeed: number; // Scroll animation duration in milliseconds (100-1000)
  autoScrollStopOnMouseEnter: boolean;

  // Layout & Dimensions
  maxWidth: number;
  paddingY: number;

  // Color System
  bgColor: string;
  borderColor: string;

  // UI State
  showCode: boolean;
  copied: boolean;
}

export const DEFAULT_SANDBOX_STATE: SandboxCarouselState = {
  itemsPerView: 3,
  gap: 16,
  loop: true,
  dragFree: true,
  navStyle: "none",
  dotsPosition: "none",
  dataLimit: 12,
  orientation: "horizontal",
  rows: 1,
  columns: 1,
  autoPlay: false,
  autoPlaySpeed: 1,
  autoPlayStopOnMouseEnter: true,
  autoPlayResumeDelay: 0,
  autoScroll: false,
  autoScrollInterval: 3000, // 3 seconds
  autoScrollSpeed: 300, // 300ms animation
  autoScrollStopOnMouseEnter: true,
  maxWidth: 1200,
  paddingY: 24,
  bgColor: "#ffffff",
  borderColor: "#c2c2c2",
  showCode: false,
  copied: false,
};

export function useSandboxCarouselState() {
  const [itemsPerView, setItemsPerView] = useState(
    DEFAULT_SANDBOX_STATE.itemsPerView,
  );
  const [gap, setGap] = useState(DEFAULT_SANDBOX_STATE.gap);
  const [loop, setLoop] = useState(DEFAULT_SANDBOX_STATE.loop);
  const [dragFree, setDragFree] = useState(DEFAULT_SANDBOX_STATE.dragFree);
  const [navStyle, setNavStyle] = useState<
    "none" | "default" | "inside" | "outside"
  >(DEFAULT_SANDBOX_STATE.navStyle);
  const [dotsPosition, setDotsPosition] = useState<"none" | "top" | "bottom">(
    DEFAULT_SANDBOX_STATE.dotsPosition,
  );
  const [dataLimit, setDataLimit] = useState(DEFAULT_SANDBOX_STATE.dataLimit);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    DEFAULT_SANDBOX_STATE.orientation,
  );
  const [rows, setRows] = useState(DEFAULT_SANDBOX_STATE.rows);
  const [columns, setColumns] = useState(DEFAULT_SANDBOX_STATE.columns);
  const [maxWidth, setMaxWidth] = useState(DEFAULT_SANDBOX_STATE.maxWidth);
  const [paddingY, setPaddingY] = useState(DEFAULT_SANDBOX_STATE.paddingY);
  const [bgColor, setBgColor] = useState(DEFAULT_SANDBOX_STATE.bgColor);
  const [borderColor, setBorderColor] = useState(
    DEFAULT_SANDBOX_STATE.borderColor,
  );
  const [showCode, setShowCode] = useState(DEFAULT_SANDBOX_STATE.showCode);
  const [copied, setCopied] = useState(DEFAULT_SANDBOX_STATE.copied);
  const [autoPlay, setAutoPlay] = useState(DEFAULT_SANDBOX_STATE.autoPlay);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(
    DEFAULT_SANDBOX_STATE.autoPlaySpeed,
  );
  const [autoPlayStopOnMouseEnter, setAutoPlayStopOnMouseEnter] = useState(
    DEFAULT_SANDBOX_STATE.autoPlayStopOnMouseEnter,
  );
  const [autoPlayResumeDelay, setAutoPlayResumeDelay] = useState(
    DEFAULT_SANDBOX_STATE.autoPlayResumeDelay,
  );
  const [autoScroll, setAutoScroll] = useState(
    DEFAULT_SANDBOX_STATE.autoScroll,
  );
  const [autoScrollInterval, setAutoScrollInterval] = useState(
    DEFAULT_SANDBOX_STATE.autoScrollInterval,
  );
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(
    DEFAULT_SANDBOX_STATE.autoScrollSpeed,
  );
  const [autoScrollStopOnMouseEnter, setAutoScrollStopOnMouseEnter] = useState(
    DEFAULT_SANDBOX_STATE.autoScrollStopOnMouseEnter,
  );

  const resetConfig = () => {
    setItemsPerView(DEFAULT_SANDBOX_STATE.itemsPerView);
    setGap(DEFAULT_SANDBOX_STATE.gap);
    setLoop(DEFAULT_SANDBOX_STATE.loop);
    setDragFree(DEFAULT_SANDBOX_STATE.dragFree);
    setNavStyle(DEFAULT_SANDBOX_STATE.navStyle);
    setDotsPosition(DEFAULT_SANDBOX_STATE.dotsPosition);
    setDataLimit(DEFAULT_SANDBOX_STATE.dataLimit);
    setOrientation(DEFAULT_SANDBOX_STATE.orientation);
    setRows(DEFAULT_SANDBOX_STATE.rows);
    setColumns(DEFAULT_SANDBOX_STATE.columns);
    setAutoPlay(DEFAULT_SANDBOX_STATE.autoPlay);
    setAutoPlaySpeed(DEFAULT_SANDBOX_STATE.autoPlaySpeed);
    setAutoPlayStopOnMouseEnter(DEFAULT_SANDBOX_STATE.autoPlayStopOnMouseEnter);
    setAutoPlayResumeDelay(DEFAULT_SANDBOX_STATE.autoPlayResumeDelay);
    setAutoScroll(DEFAULT_SANDBOX_STATE.autoScroll);
    setAutoScrollInterval(DEFAULT_SANDBOX_STATE.autoScrollInterval);
    setAutoScrollSpeed(DEFAULT_SANDBOX_STATE.autoScrollSpeed);
    setAutoScrollStopOnMouseEnter(
      DEFAULT_SANDBOX_STATE.autoScrollStopOnMouseEnter,
    );
    setMaxWidth(DEFAULT_SANDBOX_STATE.maxWidth);
    setPaddingY(DEFAULT_SANDBOX_STATE.paddingY);
    setBgColor(DEFAULT_SANDBOX_STATE.bgColor);
    setBorderColor(DEFAULT_SANDBOX_STATE.borderColor);
  };

  return {
    // Values
    itemsPerView,
    gap,
    loop,
    dragFree,
    navStyle,
    dotsPosition,
    dataLimit,
    orientation,
    rows,
    columns,
    autoPlay,
    autoPlaySpeed,
    autoPlayStopOnMouseEnter,
    autoPlayResumeDelay,
    autoScroll,
    autoScrollInterval,
    autoScrollSpeed,
    autoScrollStopOnMouseEnter,
    maxWidth,
    paddingY,
    bgColor,
    borderColor,
    showCode,
    copied,

    // Setters
    setItemsPerView,
    setGap,
    setLoop,
    setDragFree,
    setNavStyle,
    setDotsPosition,
    setDataLimit,
    setOrientation,
    setRows,
    setColumns,
    setAutoPlay,
    setAutoPlaySpeed,
    setAutoPlayStopOnMouseEnter,
    setAutoPlayResumeDelay,
    setAutoScroll,
    setAutoScrollInterval,
    setAutoScrollSpeed,
    setAutoScrollStopOnMouseEnter,
    setMaxWidth,
    setPaddingY,
    setBgColor,
    setBorderColor,
    setShowCode,
    setCopied,

    // Actions
    resetConfig,
  };
}
