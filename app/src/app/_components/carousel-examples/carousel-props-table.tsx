/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                     CAROUSEL PROPS REFERENCE TABLE                        ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  A comprehensive reference table for all Carousel component props.        ║
 * ║  Displays prop names, types, default values, and descriptions in a        ║
 * ║  structured, easy-to-read format.                                         ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export default function CarouselPropsTable() {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-xl font-semibold">Carousel Props Reference</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-white/20">
              <th className="border border-white/10 bg-white/5 px-4 py-3 text-left font-semibold">
                Prop
              </th>
              <th className="border border-white/10 bg-white/5 px-4 py-3 text-left font-semibold">
                Type
              </th>
              <th className="border border-white/10 bg-white/5 px-4 py-3 text-left font-semibold">
                Default
              </th>
              <th className="border border-white/10 bg-white/5 px-4 py-3 text-left font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Data & Rendering */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                items
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                T[]
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                required
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Array of data items to display in the carousel
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                renderItem
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                (item, index) =&gt; ReactNode
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                required
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Function to render each carousel item
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                renderLoadingItem
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                () =&gt; ReactNode
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Function to render loading skeleton items
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                renderEmptyItem
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                () =&gt; ReactNode
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Function to render empty state when no items
              </td>
            </tr>

            {/* Loading State */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                isLoading
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                boolean
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                false
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Shows skeleton items when true
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                loadingCount
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                number
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                4
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Number of skeleton items to show during loading
              </td>
            </tr>

            {/* Layout & Styling */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                itemsPerView
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                number | &quot;auto&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                &quot;auto&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Number of items visible at once, or &quot;auto&quot; for
                responsive sizing
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                gap
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                number
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                16
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Gap between carousel items in pixels
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                orientation
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                &quot;horizontal&quot; | &quot;vertical&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                &quot;horizontal&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Carousel scroll direction
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                className
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                string
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Additional CSS classes for carousel container
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                itemClassName
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                string
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Additional CSS classes for each carousel item
              </td>
            </tr>

            {/* Navigation & Pagination */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                navigation
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                NavigationConfig
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                {`{ show: true }`}
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Previous/next buttons configuration (show, position, className)
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                dots
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                DotsConfig
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                {`{ show: false }`}
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Pagination dots configuration (show, position, className)
              </td>
            </tr>

            {/* Embla Options */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                loop
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                boolean
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                false
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Enable infinite loop scrolling
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                dragFree
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                boolean
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                true
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Enable free dragging (pixel-by-pixel, not snapping)
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                align
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                &quot;start&quot; | &quot;center&quot; | &quot;end&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                &quot;start&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Item alignment within viewport
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                containScroll
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                &quot;trimSnaps&quot; | &quot;keepSnaps&quot; | false
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                &quot;trimSnaps&quot;
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Scroll containment behavior
              </td>
            </tr>

            {/* Plugins */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                autoplay
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                AutoplayConfig
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Autoplay configuration for continuous scrolling (banner/ticker
                effect)
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                autoScroll
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                AutoScrollConfig
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Auto-scroll configuration for automatic slide progression
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                wheelGestures
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                WheelGesturesConfig
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                {`{ enabled: true }`}
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Mouse wheel and trackpad scrolling configuration
              </td>
            </tr>

            {/* Callbacks */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                onSlideChange
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                (index) =&gt; void
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Callback fired when active slide changes
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                onApiReady
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                (api) =&gt; void
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Callback fired when carousel API is ready
              </td>
            </tr>

            {/* Infinite Loading */}
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                hasNextPage
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                boolean
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                false
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Whether there are more pages to fetch
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                fetchNextPage
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                () =&gt; void
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                undefined
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Callback to fetch the next page of data
              </td>
            </tr>
            <tr className="group hover:bg-white/5">
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-blue-400">
                isFetchingNextPage
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-400">
                boolean
              </td>
              <td className="border border-white/10 px-4 py-3 font-mono text-xs text-gray-500">
                false
              </td>
              <td className="border border-white/10 px-4 py-3 text-gray-300">
                Whether a page fetch is currently in progress
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
