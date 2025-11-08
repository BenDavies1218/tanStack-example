import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortField = "rank" | "name" | "price" | "24hChange" | "marketCap";
type SortOrder = "asc" | "desc";

const categories = [
  "All",
  "Cryptocurrency",
  "DeFi",
  "NFT",
  "Gaming",
  "Metaverse",
  "Stablecoin",
  "Exchange",
];

interface InfiniteInputControlsProps {
  search: string;
  category: string;
  sortField: SortField;
  sortOrder: SortOrder;
  totalItems: number;
  pagesLoaded: number;
  hasNextPage: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortFieldChange: (value: SortField) => void;
  onSortOrderToggle: () => void;
}

export const InfiniteInputControls = ({
  search,
  category,
  sortField,
  sortOrder,
  totalItems,
  pagesLoaded,
  hasNextPage,
  onSearchChange,
  onCategoryChange,
  onSortFieldChange,
  onSortOrderToggle,
}: InfiniteInputControlsProps) => {
  return (
    <div>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Name or symbol..."
          />
        </div>

        {/* Sort Field */}
        <div className="space-y-2">
          <Label htmlFor="sortField">Sort By</Label>
          <div className="flex gap-2">
            <Select value={sortField} onValueChange={onSortFieldChange}>
              <SelectTrigger id="sortField" className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="24hChange">24h Change</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onSortOrderToggle} variant="outline" size="icon">
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-400">Total Items:</span>{" "}
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div>
            <span className="text-gray-400">Pages Loaded:</span>{" "}
            <span className="font-semibold">{pagesLoaded}</span>
          </div>
        </div>
        {hasNextPage && (
          <div className="text-xs text-gray-500">More items available</div>
        )}
      </div>
    </div>
  );
};

export type { SortField, SortOrder };
