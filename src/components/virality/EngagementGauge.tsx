import { cn } from "@/lib/utils";

interface EngagementGaugeProps {
  value: number; // 0-100
  className?: string;
}

export const EngagementGauge = ({ value, className }: EngagementGaugeProps) => {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex-1">
        <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-viral-track">
          <div
            className="h-full rounded-full bg-viral-accent transition-[width] duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex max-w-[200px] justify-between text-xs font-semibold tracking-wide text-muted-foreground">
          <span>LOW</span>
          <span>HIGH</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-muted-foreground">Engagement</p>
        <p className="text-3xl font-bold leading-none text-foreground">
          {Math.round(pct)}
          <span className="text-lg font-medium text-muted-foreground"> /100</span>
        </p>
      </div>
    </div>
  );
};
