"use client";

import { useState } from "react";
import { Carousel } from "@/app/_components/generic-carousel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    LOADING CAROUSEL EXAMPLE                               ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  This component demonstrates loading states and empty states in the       ║
 * ║  Carousel component. Perfect for understanding how to handle async        ║
 * ║  data fetching scenarios.                                                 ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Simulated loading state with skeleton items                            ║
 * ║  • Configurable loading duration (1s, 2s, 3s)                             ║
 * ║  • Configurable loading item count (2, 3, 4)                              ║
 * ║  • Empty state when no items available                                    ║
 * ║  • Interactive controls to trigger states                                 ║
 * ║  • Skeleton cards with pulse animation                                    ║
 * ║                                                                           ║
 * ║  USE CASES:                                                               ║
 * ║  • Initial data fetch from API                                            ║
 * ║  • Slow network conditions                                                ║
 * ║  • Empty result sets                                                      ║
 * ║  • Error recovery flows                                                   ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Types
// ============================================================================

type MockAsset = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  color: string;
};

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_ASSETS: MockAsset[] = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 43250.5,
    change: 2.34,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: 2280.75,
    change: 1.87,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "3",
    name: "Cardano",
    symbol: "ADA",
    price: 0.512,
    change: -0.45,
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "4",
    name: "Solana",
    symbol: "SOL",
    price: 98.32,
    change: 5.23,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "5",
    name: "Polkadot",
    symbol: "DOT",
    price: 7.45,
    change: -1.23,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "6",
    name: "Avalanche",
    symbol: "AVAX",
    price: 36.78,
    change: 3.45,
    color: "from-red-500 to-orange-500",
  },
];

// ============================================================================
// Render Functions
// ============================================================================

const renderItem = (asset: MockAsset) => (
  <div
    className={`flex h-full flex-col rounded-lg border border-white/10 bg-gradient-to-br ${asset.color} p-6 text-white shadow-lg`}
  >
    <div className="mb-4">
      <h3 className="text-2xl font-bold">{asset.name}</h3>
      <p className="text-sm opacity-90">{asset.symbol}</p>
    </div>

    <div className="mb-4 flex-1">
      <div className="text-3xl font-bold">
        ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <div
        className={`mt-2 text-lg font-semibold ${
          asset.change >= 0 ? "text-white/90" : "text-white/70"
        }`}
      >
        {asset.change >= 0 ? "↑" : "↓"} {Math.abs(asset.change).toFixed(2)}%
      </div>
    </div>

    <div className="border-t border-white/20 pt-4">
      <div className="text-sm opacity-80">24h Change</div>
    </div>
  </div>
);

const renderLoadingItem = () => (
  <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
    {/* Header Skeleton */}
    <div className="mb-4">
      <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-4 w-16 animate-pulse rounded bg-white/10" />
    </div>

    {/* Price Skeleton */}
    <div className="mb-4 flex-1">
      <div className="h-10 w-40 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-6 w-24 animate-pulse rounded bg-white/10" />
    </div>

    {/* Footer Skeleton */}
    <div className="border-t border-white/10 pt-4">
      <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
    </div>
  </div>
);

const renderEmptyItem = () => (
  <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5">
    <div className="text-center">
      <div className="mb-4 text-6xl">📭</div>
      <p className="text-xl font-semibold text-gray-300">No Assets Available</p>
      <p className="mt-2 text-sm text-gray-400">
        Click "Load Data" to fetch some assets
      </p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * LoadingCarouselExample
 *
 * Demonstrates loading and empty states in the Carousel component.
 * Useful for understanding how the component behaves during async operations.
 *
 * STATE TRANSITIONS:
 * 1. Empty State → User clicks "Load Data"
 * 2. Loading State → Skeleton items displayed
 * 3. Loaded State → Actual items displayed
 * 4. User can clear data to return to Empty State
 */
export default function LoadingCarouselExample() {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState<MockAsset[]>([]);
  const [loadingDuration, setLoadingDuration] = useState(2000);
  const [loadingCount, setLoadingCount] = useState(3);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleLoadData = () => {
    setIsLoading(true);
    setAssets([]); // Clear existing data

    // Simulate API call
    setTimeout(() => {
      setAssets(MOCK_ASSETS);
      setIsLoading(false);
    }, loadingDuration);
  };

  const handleClearData = () => {
    setAssets([]);
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="rounded-lg bg-white/10 p-6">
        <h2 className="mb-2 text-xl font-semibold">Loading States Example</h2>
        <p className="text-sm text-gray-400">
          This example demonstrates how the carousel handles loading and empty
          states. Configure the settings below and click "Load Data" to
          simulate an API call with skeleton loaders.
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-lg bg-white/10 p-6">
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          {/* Loading Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Loading Duration</Label>
            <Select
              value={loadingDuration.toString()}
              onValueChange={(value) => setLoadingDuration(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">1 second</SelectItem>
                <SelectItem value="2000">2 seconds</SelectItem>
                <SelectItem value="3000">3 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading Item Count */}
          <div className="space-y-2">
            <Label htmlFor="loadingCount">Skeleton Items</Label>
            <Select
              value={loadingCount.toString()}
              onValueChange={(value) => setLoadingCount(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="loadingCount">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 items</SelectItem>
                <SelectItem value="3">3 items</SelectItem>
                <SelectItem value="4">4 items</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <Button
              onClick={handleLoadData}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Loading..." : "Load Data"}
            </Button>
            <Button
              onClick={handleClearData}
              disabled={isLoading || assets.length === 0}
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isLoading
                ? "animate-pulse bg-yellow-400"
                : assets.length > 0
                  ? "bg-green-400"
                  : "bg-gray-400"
            }`}
          />
          <span className="text-xs text-gray-400">
            {isLoading
              ? "Loading..."
              : assets.length > 0
                ? `Loaded ${assets.length} items`
                : "Empty - No data"}
          </span>
        </div>
      </div>

      {/* Carousel */}
      <Carousel<MockAsset>
        items={assets}
        renderItem={renderItem}
        renderLoadingItem={renderLoadingItem}
        renderEmptyItem={renderEmptyItem}
        isLoading={isLoading}
        loadingCount={loadingCount}
        itemsPerView={3}
        gap={20}
        navigation={{ show: true, position: "inside" }}
        dots={{ show: !isLoading && assets.length > 0 }}
        loop
        className="rounded-lg bg-black/20 px-4 py-8"
        itemClassName="h-72"
      />

      {/* State Explanation */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="mb-3 font-semibold">Current State:</h3>
        <div className="space-y-2 text-sm text-gray-400">
          {isLoading && (
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">⏳</span>
              <p>
                <strong className="text-yellow-400">Loading State:</strong>{" "}
                Displaying {loadingCount} skeleton items with pulse animation.
                This is what users see while data is being fetched.
              </p>
            </div>
          )}
          {!isLoading && assets.length === 0 && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400">📭</span>
              <p>
                <strong className="text-gray-400">Empty State:</strong> No data
                available. The carousel displays a custom empty state message
                instead of the carousel structure.
              </p>
            </div>
          )}
          {!isLoading && assets.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>
                <strong className="text-green-400">Loaded State:</strong> Data
                successfully loaded. The carousel displays actual items with
                full interactivity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
