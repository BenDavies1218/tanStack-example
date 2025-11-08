import { Label } from "@/components/ui/label";

interface BannerInputControlsProps {
  speed: number;
  resumeDelay: number;
  onSpeedChange: (value: number) => void;
  onResumeDelayChange: (value: number) => void;
}

export const AutoPlayInputControls = ({
  speed,
  resumeDelay,
  onSpeedChange,
  onResumeDelayChange,
}: BannerInputControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Speed Control */}
      <div className="space-y-2">
        <Label htmlFor="speed">Scroll Speed: {speed.toFixed(1)} px/frame</Label>
        <input
          id="speed"
          type="range"
          min="-3"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="accent-primary w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>← Reverse (-3)</span>
          <span>Stop (0)</span>
          <span>Forward (3) →</span>
        </div>
      </div>

      {/* Resume Delay Control */}
      <div className="space-y-2">
        <Label htmlFor="resumeDelay">
          Resume Delay: {(resumeDelay / 1000).toFixed(1)}s{" "}
          {resumeDelay === 0 ? "(Default)" : ""}
        </Label>
        <input
          id="resumeDelay"
          type="range"
          min="0"
          max="2000"
          step="100"
          value={resumeDelay}
          onChange={(e) => onResumeDelayChange(Number(e.target.value))}
          className="accent-primary w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Instant (0s)</span>
          <span>2 seconds</span>
        </div>
      </div>

      {/* Info Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded border border-white/10 bg-black/20 p-4">
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Direction:{" "}
              {speed === 0 ? "Stopped" : speed > 0 ? "Forward →" : "← Backward"}
            </div>
            <div className="text-xs text-gray-400">
              {speed === 0
                ? "Adjust slider to start scrolling"
                : `Moving at ${Math.abs(speed).toFixed(1)} pixels per frame`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {Math.abs(speed).toFixed(1)}x
            </div>
            <div className="text-xs text-gray-400">Speed</div>
          </div>
        </div>

        <div className="rounded border border-white/10 bg-black/20 p-4">
          <div className="text-sm font-medium">
            Resume Delay: {(resumeDelay / 1000).toFixed(1)}s
          </div>
          <div className="text-xs text-gray-400">
            {resumeDelay === 0
              ? "Resumes immediately after mouse leaves"
              : `Waits ${(resumeDelay / 1000).toFixed(1)}s after mouse leaves to resume`}
          </div>
        </div>
      </div>
    </div>
  );
};
