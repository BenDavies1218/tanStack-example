import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================================
// Carousel Configuration Panel
// ============================================================================

interface CarouselConfigPanelProps {
  itemsPerView: number;
  gap: number;
  loop: boolean;
  dragFree: boolean;
  navStyle: "none" | "default" | "inside" | "outside";
  dotsPosition: "none" | "top" | "bottom";
  dataLimit: number;
  orientation: "horizontal" | "vertical";
  rows: number;
  columns: number;
  autoPlay: boolean;
  autoPlaySpeed: number;
  autoPlayStopOnMouseEnter: boolean;
  autoScroll: boolean;
  autoScrollInterval: number;
  autoScrollSpeed: number;
  autoScrollStopOnMouseEnter: boolean;
  onItemsPerViewChange: (value: number) => void;
  onGapChange: (value: number) => void;
  onLoopChange: (value: boolean) => void;
  onDragFreeChange: (value: boolean) => void;
  onNavStyleChange: (value: "none" | "default" | "inside" | "outside") => void;
  onDotsPositionChange: (value: "none" | "top" | "bottom") => void;
  onDataLimitChange: (value: number) => void;
  onOrientationChange: (value: "horizontal" | "vertical") => void;
  onRowsChange: (value: number) => void;
  onColumnsChange: (value: number) => void;
  onAutoPlayChange: (value: boolean) => void;
  onAutoPlaySpeedChange: (value: number) => void;
  onAutoPlayStopOnMouseEnterChange: (value: boolean) => void;
  onAutoScrollChange: (value: boolean) => void;
  onAutoScrollIntervalChange: (value: number) => void;
  onAutoScrollSpeedChange: (value: number) => void;
  onAutoScrollStopOnMouseEnterChange: (value: boolean) => void;
  onRefetch: () => void;
}

export function CarouselConfigPanel({
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
  autoScroll,
  autoScrollInterval,
  autoScrollSpeed,
  autoScrollStopOnMouseEnter,
  onItemsPerViewChange,
  onGapChange,
  onLoopChange,
  onDragFreeChange,
  onNavStyleChange,
  onDotsPositionChange,
  onDataLimitChange,
  onOrientationChange,
  onRowsChange,
  onColumnsChange,
  onAutoPlayChange,
  onAutoPlaySpeedChange,
  onAutoPlayStopOnMouseEnterChange,
  onAutoScrollChange,
  onAutoScrollIntervalChange,
  onAutoScrollSpeedChange,
  onAutoScrollStopOnMouseEnterChange,
  onRefetch,
}: CarouselConfigPanelProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Carousel Configuration</h4>

      {/* Items Per View */}
      <div className="space-y-2">
        <Label className="text-xs">Items Per View: {itemsPerView}</Label>
        <Slider
          value={[itemsPerView]}
          onValueChange={(value) => {
            const val = value[0];
            if (val !== undefined) onItemsPerViewChange(val);
          }}
          min={1}
          max={5}
          step={1}
        />
      </div>

      {/* Gap */}
      <div className="space-y-2">
        <Label className="text-xs">Gap: {gap}px</Label>
        <Slider
          value={[gap]}
          onValueChange={(value) => {
            const val = value[0];
            if (val !== undefined) onGapChange(val);
          }}
          min={0}
          max={32}
          step={4}
        />
      </div>

      {/* Data Limit */}
      <div className="space-y-2">
        <Label className="text-xs">Data Limit: {dataLimit}</Label>
        <Slider
          value={[dataLimit]}
          onValueChange={(value) => {
            const val = value[0];
            if (val !== undefined) {
              onDataLimitChange(val);
              onRefetch();
            }
          }}
          min={6}
          max={100}
          step={6}
        />
      </div>

      {/* Orientation */}
      <div className="space-y-2">
        <Label className="text-xs">Orientation</Label>
        <Select value={orientation} onValueChange={onOrientationChange}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rows (for horizontal) / Columns (for vertical) */}
      {orientation === "horizontal" ? (
        <div className="space-y-2">
          <Label className="text-xs">Rows: {rows}</Label>
          <Slider
            value={[rows]}
            onValueChange={(value) => {
              const val = value[0];
              if (val !== undefined) onRowsChange(val);
            }}
            min={1}
            max={5}
            step={1}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-xs">Columns: {columns}</Label>
          <Slider
            value={[columns]}
            onValueChange={(value) => {
              const val = value[0];
              if (val !== undefined) onColumnsChange(val);
            }}
            min={1}
            max={5}
            step={1}
          />
        </div>
      )}

      {/* Navigation Style */}
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Navigation</Label>
          <Select value={navStyle} onValueChange={onNavStyleChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="inside">Inside</SelectItem>
              <SelectItem value="outside">Outside</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dots Position */}
        <div className="space-y-2">
          <Label className="text-xs">Dots</Label>
          <Select value={dotsPosition} onValueChange={onDotsPositionChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dots Position */}
        <div className="space-y-2">
          <Label className="text-xs">Type</Label>
          <Select value={dotsPosition} onValueChange={onDotsPositionChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="top">Shadcn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Loop</Label>
          <Switch checked={loop} onCheckedChange={onLoopChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Free Drag</Label>
          <Switch checked={dragFree} onCheckedChange={onDragFreeChange} />
        </div>

        {/* Auto Play Toggle */}
        <div className="space-y-2 rounded-md border border-white/10 p-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Auto Play (Continuous)</Label>
            <Switch checked={autoPlay} onCheckedChange={onAutoPlayChange} />
          </div>
          {autoPlay && (
            <div className="space-y-2 border-t border-white/5 pt-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-400">
                  Speed: {autoPlaySpeed}px/frame
                </Label>
                <Slider
                  value={[autoPlaySpeed]}
                  onValueChange={(value) => {
                    const val = value[0];
                    if (val !== undefined) onAutoPlaySpeedChange(val);
                  }}
                  min={1}
                  max={5}
                  step={0.5}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-gray-400">
                  Stop on Mouse Enter
                </Label>
                <Switch
                  checked={autoPlayStopOnMouseEnter}
                  onCheckedChange={onAutoPlayStopOnMouseEnterChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Auto Scroll Toggle */}
        <div className="space-y-2 rounded-md border border-white/10 p-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Auto Scroll (Slides)</Label>
            <Switch checked={autoScroll} onCheckedChange={onAutoScrollChange} />
          </div>
          {autoScroll && (
            <div className="space-y-2 border-t border-white/5 pt-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-400">
                  Interval: {(autoScrollInterval / 1000).toFixed(1)}s
                </Label>
                <Slider
                  value={[autoScrollInterval]}
                  onValueChange={(value) => {
                    const val = value[0];
                    if (val !== undefined) onAutoScrollIntervalChange(val);
                  }}
                  min={1000}
                  max={10000}
                  step={1000}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-400">
                  Speed: {autoScrollSpeed}ms
                </Label>
                <Slider
                  value={[autoScrollSpeed]}
                  onValueChange={(value) => {
                    const val = value[0];
                    if (val !== undefined) onAutoScrollSpeedChange(val);
                  }}
                  min={100}
                  max={1000}
                  step={100}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-gray-400">
                  Stop on Mouse Enter
                </Label>
                <Switch
                  checked={autoScrollStopOnMouseEnter}
                  onCheckedChange={onAutoScrollStopOnMouseEnterChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Layout & Style Configuration Panel
// ============================================================================

interface LayoutStyleConfigPanelProps {
  maxWidth: number;
  paddingY: number;
  bgColor: string;
  borderColor: string;
  onMaxWidthChange: (value: number) => void;
  onPaddingYChange: (value: number) => void;
  onBgColorChange: (value: string) => void;
  onBorderColorChange: (value: string) => void;
}

export function LayoutStyleConfigPanel({
  maxWidth,
  paddingY,
  bgColor,
  borderColor,
  onMaxWidthChange,
  onPaddingYChange,
  onBgColorChange,
  onBorderColorChange,
}: LayoutStyleConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* Layout Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Layout & Dimensions</h4>

        {/* Max Width */}
        <div className="space-y-2">
          <Label className="text-xs">Max Width: {maxWidth}px</Label>
          <Slider
            value={[maxWidth]}
            onValueChange={(value) => {
              const val = value[0];
              if (val !== undefined) onMaxWidthChange(val);
            }}
            min={600}
            max={1400}
            step={50}
          />
        </div>

        {/* Padding Y */}
        <div className="space-y-2">
          <Label className="text-xs">Padding Y: {paddingY}px</Label>
          <Slider
            value={[paddingY]}
            onValueChange={(value) => {
              const val = value[0];
              if (val !== undefined) onPaddingYChange(val);
            }}
            min={0}
            max={64}
            step={4}
          />
        </div>
      </div>

      {/* Color System Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Color System</h4>

        {/* Background Color */}
        <div className="space-y-2">
          <Label className="text-xs">Background</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="h-9 w-14 p-1"
            />
            <Input
              type="text"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="h-9 flex-1 font-mono text-xs"
            />
          </div>
        </div>

        {/* Border Color */}
        <div className="space-y-2">
          <Label className="text-xs">Border</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={borderColor}
              onChange={(e) => onBorderColorChange(e.target.value)}
              className="h-9 w-14 p-1"
            />
            <Input
              type="text"
              value={borderColor}
              onChange={(e) => onBorderColorChange(e.target.value)}
              className="h-9 flex-1 font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
