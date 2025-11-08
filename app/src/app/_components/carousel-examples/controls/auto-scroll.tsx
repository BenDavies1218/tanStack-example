import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AutoScrollInputControlsProps {
  interval: number;
  speed: number;
  itemsPerView: number;
  onIntervalChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onItemsPerViewChange: (value: number) => void;
}

export const AutoScrollInputControls = ({
  interval,
  speed,
  itemsPerView,
  onIntervalChange,
  onSpeedChange,
  onItemsPerViewChange,
}: AutoScrollInputControlsProps) => {
  return (
    <div className="mb-4 grid gap-4 md:grid-cols-3">
      {/* Interval between slides */}
      <div className="space-y-2">
        <Label htmlFor="interval">
          Interval: {(interval / 1000).toFixed(1)}s
        </Label>
        <Select
          value={interval.toString()}
          onValueChange={(value) => onIntervalChange(Number(value))}
        >
          <SelectTrigger id="interval">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">2 seconds</SelectItem>
            <SelectItem value="3000">3 seconds</SelectItem>
            <SelectItem value="5000">5 seconds</SelectItem>
            <SelectItem value="10000">10 seconds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scroll animation speed */}
      <div className="space-y-2">
        <Label htmlFor="speed">Scroll Speed: {speed}ms</Label>
        <input
          id="speed"
          type="range"
          min="50"
          max="500"
          step="25"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="accent-primary w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Fast (50ms)</span>
          <span>Slow (500ms)</span>
        </div>
      </div>

      {/* Items Per View */}
      <div className="space-y-2">
        <Label htmlFor="itemsPerView">Items Per View</Label>
        <Select
          value={itemsPerView.toString()}
          onValueChange={(value) => onItemsPerViewChange(Number(value))}
        >
          <SelectTrigger id="itemsPerView">
            <SelectValue placeholder="Select items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 item</SelectItem>
            <SelectItem value="2">2 items</SelectItem>
            <SelectItem value="3">3 items</SelectItem>
            <SelectItem value="4">4 items</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
