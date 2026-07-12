import { cn } from "@/lib/utils";
import type { ViralityRegion } from "@/services/viralityService";

interface RegionMetricsProps {
  regions: ViralityRegion[];
  /** When true, show empty shimmering tracks (analyzing state). */
  loading?: boolean;
  className?: string;
}

const toneClass: Record<ViralityRegion["tone"], string> = {
  good: "bg-viral-accent",
  warning: "bg-viral-warning",
  danger: "bg-viral-danger",
};

const RegionBar = ({ region }: { region: ViralityRegion }) => (
  <div className="rounded-lg bg-secondary/60 p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">{region.label}</span>
      <span className="text-xs font-medium text-muted-foreground">{Math.round(region.value)}</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-viral-track">
      <div
        className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", toneClass[region.tone])}
        style={{ width: `${Math.max(0, Math.min(100, region.value))}%` }}
        title={region.hint}
      />
    </div>
  </div>
);

const LoadingBar = ({ label }: { label: string }) => (
  <div className="rounded-lg bg-secondary/60 p-4">
    <span className="mb-2 block text-sm font-semibold text-foreground">{label}</span>
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-viral-track">
      <div className="absolute inset-0 -translate-x-full animate-viral-shimmer bg-gradient-to-r from-transparent via-viral-accent/40 to-transparent" />
    </div>
  </div>
);

export const RegionMetrics = ({ regions, loading = false, className }: RegionMetricsProps) => {
  const grid = regions.filter((r) => r.key !== "focusDrift");
  const drift = regions.find((r) => r.key === "focusDrift");

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {grid.map((region) =>
          loading ? <LoadingBar key={region.key} label={region.label} /> : <RegionBar key={region.key} region={region} />,
        )}
      </div>
      {drift &&
        (loading ? <LoadingBar label={drift.label} /> : <RegionBar region={drift} />)}
    </div>
  );
};
