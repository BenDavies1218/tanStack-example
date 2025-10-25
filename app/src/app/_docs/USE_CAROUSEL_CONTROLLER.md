# useCarouselController Hook

A powerful React hook for controlling carousels with advanced features like keyboard navigation, autoplay control, progress tracking, and event handling.

## Features

- 🎮 **Full Carousel Control** - Navigate, play, pause, and reset programmatically
- ⌨️ **Keyboard Navigation** - Built-in keyboard shortcuts with customization
- 📊 **State Tracking** - Current slide, slide count, can scroll prev/next, and more
- 🎯 **Event Callbacks** - React to slide changes, reach start/end, autoplay events
- ⏱️ **Auto-advance** - Automatically advance slides after a delay
- 🎪 **Thumbnail Navigation** - Helper methods for synced thumbnail carousels
- 🔄 **Plugin Integration** - Control embla autoplay plugin from the hook

## Basic Usage

```tsx
import { CustomCarousel } from "@/components/custom-carousel";
import { useCarouselController } from "@/hooks/use-carousel-controller";

function MyCarousel() {
  const controller = useCarouselController();

  return (
    <div>
      <CustomCarousel
        controller={controller}
        items={items}
        renderItem={(item) => <div>{item.content}</div>}
      />

      {/* Custom controls */}
      <div className="mt-4 flex gap-2">
        <button onClick={controller.goToPrev}>Previous</button>
        <button onClick={controller.goToNext}>Next</button>
        <span>{controller.selectedSnapDisplay}</span>
      </div>
    </div>
  );
}
```

## API Reference

### Options

```tsx
const controller = useCarouselController({
  initialSlide: 0,
  enableKeyboard: true,
  keyboardShortcuts: {
    prev: ["ArrowLeft"],
    next: ["ArrowRight"],
    first: ["Home"],
    last: ["End"],
    play: [" ", "p"],
    pause: ["Escape"],
  },
  autoAdvanceDelay: 3000,
  onSlideChange: (index) => console.log("Slide:", index),
  onReachStart: () => console.log("Reached start"),
  onReachEnd: () => console.log("Reached end"),
  onAutoplayStart: () => console.log("Autoplay started"),
  onAutoplayStop: () => console.log("Autoplay stopped"),
});
```

#### Options Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialSlide` | `number` | `0` | Starting slide index |
| `enableKeyboard` | `boolean` | `false` | Enable keyboard navigation |
| `keyboardShortcuts` | `object` | See above | Custom keyboard shortcuts |
| `autoAdvanceDelay` | `number` | - | Auto-advance delay in ms |
| `onSlideChange` | `(index: number) => void` | - | Called when slide changes |
| `onReachStart` | `() => void` | - | Called when reaching first slide |
| `onReachEnd` | `() => void` | - | Called when reaching last slide |
| `onAutoplayStart` | `() => void` | - | Called when autoplay starts |
| `onAutoplayStop` | `() => void` | - | Called when autoplay stops |

### Return Values

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `api` | `CarouselApi \| undefined` | Embla carousel API instance |
| `currentSlide` | `number` | Current slide index (0-based) |
| `slideCount` | `number` | Total number of slides |
| `canScrollPrev` | `boolean` | Can scroll to previous slide |
| `canScrollNext` | `boolean` | Can scroll to next slide |
| `isPlaying` | `boolean` | Autoplay state |
| `selectedSnapDisplay` | `string` | e.g., "3 / 10" for display |

#### Navigation Methods

| Method | Description |
|--------|-------------|
| `goToSlide(index)` | Navigate to specific slide |
| `goToNext()` | Go to next slide |
| `goToPrev()` | Go to previous slide |
| `goToFirst()` | Go to first slide |
| `goToLast()` | Go to last slide |

#### Autoplay Controls

| Method | Description |
|--------|-------------|
| `play()` | Start autoplay |
| `pause()` | Stop autoplay |
| `toggle()` | Toggle autoplay on/off |
| `reset()` | Stop autoplay and go to first slide |

#### Utility Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getSlideProgress()` | `number` | Progress as percentage (0-100) |
| `isSlideActive(index)` | `boolean` | Check if slide is active |
| `getVisibleSlides()` | `number[]` | Array of visible slide indices |
| `scrollTo(index, jump?)` | `void` | Scroll to index (jump skips animation) |
| `thumbnailScrollTo(index)` | `void` | Helper for thumbnail navigation |

## Examples

### 1. Keyboard Navigation

```tsx
function KeyboardCarousel() {
  const controller = useCarouselController({
    enableKeyboard: true,
    keyboardShortcuts: {
      prev: ["ArrowLeft", "a"],
      next: ["ArrowRight", "d"],
      first: ["Home", "1"],
      last: ["End"],
      play: ["p", " "],
      pause: ["Escape", "s"],
    },
  });

  return (
    <div>
      <CustomCarousel
        controller={controller}
        items={slides}
        renderItem={(slide) => <SlideContent slide={slide} />}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Use arrow keys, Home/End, P to play, Esc to pause
      </p>
    </div>
  );
}
```

### 2. Auto-advance with Progress Bar

```tsx
function AutoAdvanceCarousel() {
  const controller = useCarouselController({
    autoAdvanceDelay: 4000,
    onSlideChange: (index) => {
      console.log("Advanced to slide:", index);
    },
  });

  const progress = controller.getSlideProgress();

  return (
    <div>
      <CustomCarousel
        controller={controller}
        items={banners}
        renderItem={(banner) => <Banner banner={banner} />}
      />

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Play/Pause */}
      <div className="mt-2 flex gap-2">
        <button onClick={controller.play}>Play</button>
        <button onClick={controller.pause}>Pause</button>
        <button onClick={controller.reset}>Reset</button>
      </div>
    </div>
  );
}
```

### 3. Custom Navigation UI

```tsx
function CustomNavigationCarousel() {
  const controller = useCarouselController({
    onReachStart: () => console.log("Can't go back further"),
    onReachEnd: () => console.log("Last slide!"),
  });

  return (
    <div>
      <CustomCarousel
        controller={controller}
        items={products}
        showNavigation={false} // Hide default navigation
        renderItem={(product) => <ProductCard product={product} />}
      />

      {/* Custom navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={controller.goToPrev}
          disabled={!controller.canScrollPrev}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        >
          ← Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: controller.slideCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => controller.goToSlide(i)}
              className={`w-3 h-3 rounded-full ${
                controller.isSlideActive(i)
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={controller.goToNext}
          disabled={!controller.canScrollNext}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      <p className="text-center mt-2 text-sm">
        {controller.selectedSnapDisplay}
      </p>
    </div>
  );
}
```

### 4. Thumbnail Navigation (Synced Carousels)

```tsx
function ThumbnailCarousel() {
  const mainController = useCarouselController();
  const thumbController = useCarouselController();

  // Sync thumbnail carousel to main carousel
  const handleMainSlideChange = (index: number) => {
    thumbController.goToSlide(index);
  };

  return (
    <div>
      {/* Main carousel */}
      <CustomCarousel
        controller={mainController}
        items={images}
        onSlideChange={handleMainSlideChange}
        renderItem={(image) => (
          <img
            src={image.url}
            alt={image.caption}
            className="w-full h-96 object-cover"
          />
        )}
      />

      {/* Thumbnail carousel */}
      <div className="mt-4">
        <CustomCarousel
          controller={thumbController}
          items={images}
          itemsPerView={5}
          gap={8}
          showNavigation={false}
          renderItem={(image, index) => (
            <button
              onClick={() => {
                mainController.goToSlide(index);
                thumbController.goToSlide(index);
              }}
              className={`relative ${
                mainController.isSlideActive(index)
                  ? "ring-2 ring-primary"
                  : "opacity-60"
              }`}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-20 object-cover rounded"
              />
            </button>
          )}
        />
      </div>
    </div>
  );
}
```

### 5. Video Carousel with Autoplay Control

```tsx
function VideoCarousel() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const controller = useCarouselController({
    autoAdvanceDelay: 5000,
    onSlideChange: () => {
      // Pause video when slide changes
      setIsVideoPlaying(false);
    },
  });

  // Pause carousel when video plays
  useEffect(() => {
    if (isVideoPlaying) {
      controller.pause();
    } else {
      controller.play();
    }
  }, [isVideoPlaying]);

  return (
    <CustomCarousel
      controller={controller}
      items={videos}
      renderItem={(video) => (
        <VideoPlayer
          video={video}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        />
      )}
    />
  );
}
```

### 6. Analytics Integration

```tsx
function AnalyticsCarousel() {
  const controller = useCarouselController({
    onSlideChange: (index) => {
      // Track slide view
      analytics.track("Carousel Slide Viewed", {
        slideIndex: index,
        slideName: items[index]?.name,
      });
    },
    onReachEnd: () => {
      // Track completion
      analytics.track("Carousel Completed");
    },
  });

  // Track interaction metrics
  const handleInteraction = (action: string) => {
    analytics.track("Carousel Interaction", { action });
  };

  return (
    <div>
      <CustomCarousel
        controller={controller}
        items={items}
        renderItem={(item) => <div>{item.content}</div>}
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            controller.goToPrev();
            handleInteraction("previous");
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            controller.goToNext();
            handleInteraction("next");
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 7. Fullscreen Carousel with Keyboard

```tsx
function FullscreenGallery() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controller = useCarouselController({
    enableKeyboard: isFullscreen, // Enable keyboard only in fullscreen
    keyboardShortcuts: {
      prev: ["ArrowLeft"],
      next: ["ArrowRight"],
      pause: ["Escape"], // Escape also exits fullscreen
    },
    onAutoplayStop: () => {
      // Exit fullscreen when user presses Escape
      setIsFullscreen(false);
    },
  });

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}>
      <CustomCarousel
        controller={controller}
        items={images}
        className={isFullscreen ? "h-screen" : ""}
        renderItem={(image) => (
          <img
            src={image.url}
            alt={image.caption}
            className={isFullscreen ? "w-full h-full object-contain" : ""}
          />
        )}
      />

      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-white rounded"
      >
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
    </div>
  );
}
```

### 8. Asset Carousel with TanStack Query

```tsx
import { usePostgresAssets } from "@/lib/queries/assets";
import { useCarouselController } from "@/hooks/use-carousel-controller";
import { CustomCarousel } from "@/components/custom-carousel";

function AssetCarousel() {
  const { data, isLoading } = usePostgresAssets({
    page: 1,
    pageSize: 20,
    sortBy: "marketCapRank",
    sortOrder: "asc",
  });

  const controller = useCarouselController({
    enableKeyboard: true,
    autoAdvanceDelay: 3000,
    onSlideChange: (index) => {
      const asset = data?.assets[index];
      console.log("Viewing:", asset?.name);
    },
  });

  if (isLoading) return <div>Loading assets...</div>;

  return (
    <div>
      <CustomCarousel
        controller={controller}
        items={data?.assets ?? []}
        itemsPerView={3}
        gap={24}
        loop
        renderItem={(asset) => (
          <div className="p-4 bg-white rounded-lg shadow">
            <img
              src={asset.image}
              alt={asset.name}
              className="w-12 h-12 mb-2"
            />
            <h3 className="font-bold">{asset.name}</h3>
            <p className="text-sm text-gray-600">{asset.symbol}</p>
            <p className="text-lg font-semibold">
              ${asset.currentPrice?.toLocaleString()}
            </p>
            <p
              className={
                (asset.priceChangePercentage24h ?? 0) > 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {asset.priceChangePercentage24h?.toFixed(2)}%
            </p>
          </div>
        )}
      />

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={controller.goToPrev}
            disabled={!controller.canScrollPrev}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ←
          </button>
          <button
            onClick={controller.goToNext}
            disabled={!controller.canScrollNext}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>

        <span className="text-sm text-gray-600">
          {controller.selectedSnapDisplay}
        </span>

        <button
          onClick={controller.toggle}
          className="px-3 py-1 bg-primary text-white rounded"
        >
          {controller.isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
```

## Advanced Patterns

### Multiple Controllers for Complex UIs

```tsx
function ComplexCarouselUI() {
  const heroController = useCarouselController({
    autoAdvanceDelay: 5000,
  });

  const thumbnailController = useCarouselController();

  const productController = useCarouselController({
    enableKeyboard: true,
  });

  return (
    <div>
      {/* Hero carousel */}
      <CustomCarousel controller={heroController} items={heroes} {...} />

      {/* Thumbnail navigation */}
      <CustomCarousel controller={thumbnailController} items={thumbs} {...} />

      {/* Product carousel */}
      <CustomCarousel controller={productController} items={products} {...} />
    </div>
  );
}
```

### Programmatic Control

```tsx
function ControlledCarousel() {
  const controller = useCarouselController();
  const [slideHistory, setSlideHistory] = useState<number[]>([]);

  const goToRandomSlide = () => {
    const randomIndex = Math.floor(Math.random() * controller.slideCount);
    controller.goToSlide(randomIndex);
    setSlideHistory([...slideHistory, randomIndex]);
  };

  return (
    <div>
      <CustomCarousel controller={controller} items={items} {...} />

      <div className="mt-4 flex gap-2">
        <button onClick={goToRandomSlide}>Random Slide</button>
        <button onClick={controller.goToFirst}>First</button>
        <button onClick={controller.goToLast}>Last</button>
      </div>

      <div className="mt-2">
        <p>Slide History: {slideHistory.join(" → ")}</p>
      </div>
    </div>
  );
}
```

## TypeScript

The hook is fully typed and provides excellent IntelliSense support:

```tsx
import type {
  UseCarouselControllerOptions,
  UseCarouselControllerReturn,
} from "@/hooks/use-carousel-controller";

// Options are fully typed
const options: UseCarouselControllerOptions = {
  enableKeyboard: true,
  autoAdvanceDelay: 3000,
};

// Return value is fully typed
const controller: UseCarouselControllerReturn = useCarouselController(options);

// All methods and properties have proper types
controller.goToSlide(0); // ✓
controller.currentSlide; // number
controller.isPlaying; // boolean
```

## Best Practices

1. **Use `controller` for complex interactions** - When you need custom controls, progress tracking, or keyboard navigation
2. **Enable keyboard navigation for galleries** - Improves UX for image/product galleries
3. **Use `onSlideChange` for analytics** - Track user engagement with slides
4. **Pause autoplay during video playback** - Better user experience
5. **Sync thumbnails with main carousel** - Use `thumbnailScrollTo` helper
6. **Use `autoAdvanceDelay` for slideshows** - Simple auto-advance without autoplay plugin
7. **Combine with TanStack Query** - Fetch data and control carousel together

## Differences from Built-in Carousel

| Feature | Built-in Carousel | With Controller Hook |
|---------|------------------|---------------------|
| Basic navigation | ✅ | ✅ |
| Keyboard shortcuts | ❌ | ✅ |
| Auto-advance | Autoplay plugin only | ✅ Flexible delay |
| Progress tracking | ❌ | ✅ |
| Event callbacks | Limited | ✅ Comprehensive |
| Programmatic control | Limited | ✅ Full control |
| State management | Internal | ✅ Exposed |
| Thumbnail sync | Manual | ✅ Helper methods |
