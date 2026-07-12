import { cn } from "@/lib/utils";

type BrainMode = "idle" | "scanning" | "heat";

interface BrainScanProps {
  mode: BrainMode;
  /** 0-100 — drives heat spread / glow in "heat" mode. */
  intensity?: number;
  className?: string;
}

// Stylized side-view brain. One filled silhouette + fold strokes so it reads as
// a brain in both the lime "scanning" state and the multi-hue "heat" state.
const BRAIN_OUTLINE =
  "M40,92 C32,64 58,38 96,36 C120,34 152,30 172,46 C194,60 198,92 182,114 " +
  "C178,122 186,130 176,138 C167,146 150,144 140,138 C132,154 106,156 96,142 " +
  "C84,150 62,146 58,130 C44,128 32,112 40,92 Z";

const FOLDS = [
  "M58,84 C74,72 92,74 104,86",
  "M104,60 C112,78 108,96 96,108",
  "M120,52 C132,70 130,92 118,104",
  "M138,58 C152,72 152,94 140,110",
  "M150,86 C164,90 170,104 160,118",
  "M70,110 C86,104 104,110 116,122",
  "M96,128 C110,124 126,128 136,120",
];

export const BrainScan = ({ mode, intensity = 50, className }: BrainScanProps) => {
  const glow = 0.25 + (intensity / 100) * 0.55;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl",
        mode === "heat" ? "bg-secondary" : "bg-viral-stage",
        className,
      )}
    >
      {/* Stage gradient wash (black -> lime) for the scanning state */}
      {mode !== "heat" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--viral-stage)) 20%, hsl(var(--viral-accent) / 0.28) 100%)",
          }}
        />
      )}

      <svg viewBox="0 0 220 180" className="relative z-10 mx-auto block h-full w-full max-h-72">
        <defs>
          <radialGradient id="viralLime" cx="42%" cy="38%" r="72%">
            <stop offset="0%" stopColor="hsl(74 95% 78%)" />
            <stop offset="55%" stopColor="hsl(74 95% 58%)" />
            <stop offset="100%" stopColor="hsl(74 85% 42%)" />
          </radialGradient>
          <radialGradient id="viralHeat" cx="30%" cy="34%" r="85%">
            <stop offset="0%" stopColor="hsl(52 100% 72%)" />
            <stop offset="28%" stopColor="hsl(38 100% 60%)" />
            <stop offset="62%" stopColor="hsl(8 82% 62%)" />
            <stop offset="100%" stopColor="hsl(2 70% 52%)" />
          </radialGradient>
          <clipPath id="brainClip">
            <path d={BRAIN_OUTLINE} />
          </clipPath>
        </defs>

        <g clipPath="url(#brainClip)">
          <path
            d={BRAIN_OUTLINE}
            fill={mode === "heat" ? "url(#viralHeat)" : "url(#viralLime)"}
            className={mode === "scanning" ? "animate-viral-flicker" : undefined}
          />

          {/* Heat "hotspots" — light patches like the reference render */}
          {mode === "heat" && (
            <g opacity="0.9">
              <ellipse cx="70" cy="70" rx="26" ry="20" fill="hsl(56 100% 82%)" opacity={glow} />
              <ellipse cx="150" cy="66" rx="18" ry="16" fill="hsl(0 0% 100%)" opacity="0.55" />
              <ellipse cx="120" cy="104" rx="22" ry="16" fill="hsl(0 0% 100%)" opacity="0.4" />
              <ellipse cx="96" cy="90" rx="30" ry="12" fill="hsl(0 0% 100%)" opacity="0.3" />
            </g>
          )}

          {/* Cortical folds */}
          <g
            fill="none"
            stroke={mode === "heat" ? "hsl(2 60% 40% / 0.55)" : "hsl(74 60% 22% / 0.7)"}
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            {FOLDS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          {/* Moving scan line */}
          {mode === "scanning" && (
            <g className="animate-viral-scan" style={{ transformOrigin: "center" }}>
              <line
                x1="10"
                y1="90"
                x2="210"
                y2="90"
                stroke="hsl(74 95% 70%)"
                strokeWidth="2"
                strokeDasharray="7 7"
              />
            </g>
          )}
        </g>

        {/* Brain-stem tick to ground the silhouette */}
        <path
          d="M118,150 C120,160 122,168 128,172"
          fill="none"
          stroke={mode === "heat" ? "hsl(2 70% 52%)" : "hsl(74 85% 50%)"}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
