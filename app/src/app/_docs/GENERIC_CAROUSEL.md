# Custom Carousel Component API

A flexible, feature-rich carousel component built on top of shadcn/ui carousel with embla-carousel plugins.

## Features

- 🎨 **Fully customizable** - Control layout, styling, and behavior
- 🔄 **Auto-play support** - Built-in autoplay with configurable options
- 📜 **Auto-scroll** - Continuous scrolling animation
- 🎯 **Type-safe** - Full TypeScript support with generic types
- 🎛️ **Multiple items per view** - Show 1 or more items at once
- 🔘 **Dot navigation** - Optional pagination dots
- ⌨️ **Keyboard accessible** - Arrow key navigation
- 📱 **Responsive** - Works on all screen sizes
- 🎪 **Class names plugin** - CSS class-based animations

## Installation

The component is already set up with all required dependencies:

```bash
pnpm add embla-carousel-autoplay embla-carousel-class-names embla-carousel-auto-scroll
```

## Basic Usage

```tsx
import { CustomCarousel } from "@/components/custom-carousel";

const items = [
  { id: 1, title: "Slide 1" },
  { id: 2, title: "Slide 2" },
  { id: 3, title: "Slide 3" },
];

export function BasicCarousel() {
  return (
    <CustomCarousel
      items={items}
      renderItem={(item) => (
        <div className="p-4 bg-white rounded-lg">
          <h3>{item.title}</h3>
        </div>
      )}
    />
  );
}
```

## API Reference

### Props

#### Data Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `T[]` | ✅ | Array of items to display |
| `renderItem` | `(item: T, index: number) => ReactNode` | ✅ | Function to render each item |

#### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `itemsPerView` | `number \| "auto"` | `1` | Number of items to show at once |
| `gap` | `number` | `16` | Gap between items in pixels |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Scroll direction |
| `className` | `string` | - | Container class name |
| `itemClassName` | `string` | - | Individual item class name |

#### Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showNavigation` | `boolean` | `true` | Show prev/next buttons |
| `navigationPosition` | `"default" \| "inside" \| "outside"` | `"default"` | Button position |
| `navigationClassName` | `string` | - | Navigation button class name |

#### Dots/Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showDots` | `boolean` | `false` | Show pagination dots |
| `dotsPosition` | `"bottom" \| "top" \| "inside" \| "outside"` | `"bottom"` | Dots position |
| `dotsClassName` | `string` | - | Dots container class name |

#### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loop` | `boolean` | `false` | Enable infinite loop |
| `skipSnaps` | `boolean` | `false` | Skip snapping to slides |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Slide alignment |
| `dragFree` | `boolean` | `false` | Free-form dragging |
| `containScroll` | `"trimSnaps" \| "keepSnaps" \| false` | `"trimSnaps"` | Scroll containment |

#### Autoplay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoplay` | `boolean` | `false` | Enable autoplay |
| `autoplayOptions` | `AutoplayOptionsType` | `{ delay: 3000 }` | Autoplay configuration |

**Autoplay Options:**
- `delay` (number) - Time between transitions (ms)
- `stopOnInteraction` (boolean) - Stop on user interaction
- `stopOnMouseEnter` (boolean) - Stop on mouse hover
- `stopOnFocusIn` (boolean) - Stop when focused

#### Auto-scroll Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoScroll` | `boolean` | `false` | Enable auto-scroll |
| `autoScrollOptions` | `AutoScrollOptionsType` | `{ speed: 1 }` | Auto-scroll configuration |

**Auto-scroll Options:**
- `speed` (number) - Scroll speed
- `startDelay` (number) - Delay before starting
- `stopOnInteraction` (boolean) - Stop on user interaction
- `stopOnMouseEnter` (boolean) - Stop on mouse hover

#### Event Props

| Prop | Type | Description |
|------|------|-------------|
| `onSlideChange` | `(index: number) => void` | Called when slide changes |
| `onApiReady` | `(api: CarouselApi) => void` | Called when carousel API is ready |

## Examples

### Multiple Items Per View

```tsx
<CustomCarousel
  items={products}
  itemsPerView={3}
  gap={24}
  renderItem={(product) => (
    <ProductCard product={product} />
  )}
/>
```

### With Autoplay

```tsx
<CustomCarousel
  items={banners}
  autoplay
  autoplayOptions={{
    delay: 5000,
    stopOnInteraction: false,
  }}
  loop
  showDots
  renderItem={(banner) => (
    <img src={banner.image} alt={banner.title} />
  )}
/>
```

### Auto-scroll Ticker

```tsx
<CustomCarousel
  items={logos}
  autoScroll
  autoScrollOptions={{
    speed: 0.5,
    stopOnInteraction: false,
  }}
  itemsPerView={5}
  gap={40}
  showNavigation={false}
  renderItem={(logo) => (
    <img src={logo.src} alt={logo.name} className="h-12" />
  )}
/>
```

### Vertical Carousel

```tsx
<CustomCarousel
  items={testimonials}
  orientation="vertical"
  showDots
  dotsPosition="outside"
  className="h-96"
  renderItem={(testimonial) => (
    <TestimonialCard testimonial={testimonial} />
  )}
/>
```

### With Dots and Inside Navigation

```tsx
<CustomCarousel
  items={images}
  showDots
  dotsPosition="inside"
  navigationPosition="inside"
  loop
  className="rounded-lg overflow-hidden"
  renderItem={(image) => (
    <img src={image.url} alt={image.caption} className="w-full" />
  )}
/>
```

### Responsive Items Per View

```tsx
// Use itemClassName with Tailwind responsive classes
<CustomCarousel
  items={products}
  itemsPerView={1}
  itemClassName="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
  gap={16}
  renderItem={(product) => (
    <ProductCard product={product} />
  )}
/>
```

### With Event Handlers

```tsx
const [currentSlide, setCurrentSlide] = useState(0);
const [carouselApi, setCarouselApi] = useState<CarouselApi>();

<CustomCarousel
  items={slides}
  onSlideChange={(index) => {
    console.log("Slide changed to:", index);
    setCurrentSlide(index);
  }}
  onApiReady={(api) => {
    console.log("Carousel ready");
    setCarouselApi(api);
  }}
  renderItem={(slide) => <SlideContent slide={slide} />}
/>

// You can control the carousel programmatically:
// carouselApi?.scrollNext()
// carouselApi?.scrollPrev()
// carouselApi?.scrollTo(2)
```

### Asset Carousel with Data Fetching

```tsx
import { CustomCarousel } from "@/components/custom-carousel";
import { usePostgresAssets } from "@/lib/queries/assets";

export function AssetCarousel() {
  const { data, isLoading } = usePostgresAssets({
    page: 1,
    pageSize: 10,
    sortBy: "marketCapRank",
    sortOrder: "asc",
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <CustomCarousel
      items={data?.assets ?? []}
      itemsPerView={3}
      gap={24}
      loop
      autoplay
      showDots
      renderItem={(asset) => (
        <div className="p-4 bg-white rounded-lg shadow">
          <img src={asset.image} alt={asset.name} className="w-12 h-12 mb-2" />
          <h3 className="font-bold">{asset.name}</h3>
          <p className="text-sm text-gray-600">{asset.symbol}</p>
          <p className="text-lg font-semibold">
            ${asset.currentPrice?.toLocaleString()}
          </p>
        </div>
      )}
    />
  );
}
```

### Custom Styling Example

```tsx
<CustomCarousel
  items={items}
  className="bg-gray-100 p-8 rounded-xl"
  itemClassName="transform transition-transform hover:scale-105"
  navigationClassName="bg-primary text-white hover:bg-primary/90"
  dotsClassName="mt-6"
  showDots
  showNavigation
  navigationPosition="outside"
  renderItem={(item) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {item.content}
    </div>
  )}
/>
```

## Advanced Usage

### Controlling Carousel Programmatically

```tsx
function ControlledCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  const playAutoplay = () => {
    // Access autoplay plugin and play
    api?.plugins()?.autoplay?.play();
  };

  const stopAutoplay = () => {
    api?.plugins()?.autoplay?.stop();
  };

  return (
    <>
      <CustomCarousel
        items={items}
        autoplay
        onApiReady={setApi}
        renderItem={(item) => <div>{item.content}</div>}
      />

      <div className="mt-4 flex gap-2">
        <button onClick={() => goToSlide(0)}>First</button>
        <button onClick={playAutoplay}>Play</button>
        <button onClick={stopAutoplay}>Stop</button>
      </div>
    </>
  );
}
```

## CSS Class Names Plugin

The carousel includes the `embla-carousel-class-names` plugin by default, which adds CSS classes to slides based on their state:

- `is-snapped` - Current slide(s)
- `is-in-view` - Slides currently visible
- `is-prev` - Previous slide
- `is-next` - Next slide

You can use these for custom animations:

```css
.embla__slide {
  opacity: 0.5;
  transition: opacity 0.3s;
}

.embla__slide.is-snapped {
  opacity: 1;
  transform: scale(1.05);
}
```

## TypeScript

The carousel is fully typed and accepts a generic type parameter:

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

<CustomCarousel<Product>
  items={products}
  renderItem={(product) => {
    // product is typed as Product
    return <div>{product.name}</div>;
  }}
/>
```

## Best Practices

1. **Use `itemsPerView` for fixed layouts** - For consistent item widths across the carousel
2. **Use `itemClassName` for responsive layouts** - Combine with Tailwind breakpoints for responsive designs
3. **Enable `loop` for continuous browsing** - Better UX for image galleries and product carousels
4. **Use `autoplay` for hero banners** - Great for marketing content
5. **Use `autoScroll` for tickers** - Perfect for logo strips or continuous content feeds
6. **Add `showDots` for image galleries** - Helps users track their position
7. **Use `onSlideChange` for analytics** - Track which slides users engage with
