import { useEffect, useRef, useState } from "react";
import { Brain, Link as LinkIcon, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainScan } from "./BrainScan";
import { EngagementGauge } from "./EngagementGauge";
import { RegionMetrics } from "./RegionMetrics";
import {
  predictVirality,
  type ViralityRegion,
  type ViralityResult,
} from "@/services/viralityService";

type Phase = "input" | "analyzing" | "result";

const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Kwai",
  "X / Twitter",
];

// Region labels shown while analyzing (before real values exist).
const PLACEHOLDER_REGIONS: ViralityRegion[] = [
  { key: "visual", label: "Visual Cortex", value: 0, tone: "good", higherIsBetter: true, hint: "" },
  { key: "auditory", label: "Auditory Cortex", value: 0, tone: "good", higherIsBetter: true, hint: "" },
  { key: "language", label: "Language Network", value: 0, tone: "good", higherIsBetter: true, hint: "" },
  { key: "attention", label: "Attention Control", value: 0, tone: "good", higherIsBetter: true, hint: "" },
  { key: "focusDrift", label: "Focus Drift", value: 0, tone: "danger", higherIsBetter: false, hint: "" },
];

// Demo analysis duration. Real inference runs ~2 min; we compress it so the
// widget "fills itself when it's done" without a long wait.
const ANALYSIS_MS = 5200;

function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

export const ViralityPredictor = () => {
  const [phase, setPhase] = useState<Phase>("input");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ViralityResult | null>(null);

  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((id) => window.clearInterval(id));
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const startAnalysis = () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    const predicted = predictVirality({ url: trimmed, platform, caption: caption.trim() || undefined });
    setResult(predicted);
    setProgress(0);
    setPhase("analyzing");

    const started = Date.now();
    const interval = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / ANALYSIS_MS) * 100);
      setProgress(pct);
    }, 80);
    timers.current.push(interval);

    const done = window.setTimeout(() => {
      window.clearInterval(interval);
      setProgress(100);
      setPhase("result");
    }, ANALYSIS_MS);
    timers.current.push(done);
  };

  const reset = () => {
    clearTimers();
    setPhase("input");
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-border bg-gradient-card p-1 shadow-card">
        {/* ---------- INPUT ---------- */}
        {phase === "input" && (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-viral-accent p-2">
                <Brain className="h-6 w-6 text-viral-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Virality Predictor</h2>
                <p className="text-sm text-muted-foreground">
                  Estime a força de viralização de um vídeo antes de postar.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Link do vídeo</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startAnalysis()}
                    placeholder="https://..."
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Plataforma</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Legenda / roteiro <span className="text-muted-foreground">(opcional)</span>
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Cole a legenda ou descreva o gancho do vídeo..."
                  rows={3}
                />
              </div>

              <Button
                onClick={startAnalysis}
                disabled={!url.trim()}
                className="w-full bg-viral-accent font-semibold text-viral-accent-foreground hover:bg-viral-accent/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Analisar viralização
              </Button>
            </div>
          </div>
        )}

        {/* ---------- ANALYZING ---------- */}
        {phase === "analyzing" && (
          <div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-viral-accent">
              <span className="absolute left-0 top-0 z-20 rounded-br-2xl bg-viral-accent px-4 py-1.5 text-sm font-bold text-viral-accent-foreground">
                Analyzing
              </span>
              <BrainScan mode="scanning" className="h-72" />
              <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-3">
                <span className="animate-viral-pulse text-sm font-semibold text-muted-foreground">
                  Submitting Virality Predictor
                </span>
                <span className="text-sm font-semibold text-viral-accent">{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="p-4">
              <RegionMetrics regions={PLACEHOLDER_REGIONS} loading />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                O dashboard preenche sozinho quando termina.
              </p>
            </div>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === "result" && result && (
          <div className="p-4">
            <div className="rounded-2xl bg-secondary/40 p-5">
              <EngagementGauge value={result.engagement} />

              <BrainScan mode="heat" intensity={result.engagement} className="my-4 h-64" />

              <div className="grid grid-cols-3 gap-2">
                <Stat label="Duration" value={formatDuration(result.durationSec)} />
                <Stat label="Hook Score" value={String(Math.round(result.hookScore))} />
                <Stat label="Sustain" value={`${Math.round(result.sustainPct)}%`} />
              </div>
            </div>

            <div className="mt-3">
              <RegionMetrics regions={result.regions} />
            </div>

            <div className="mt-3 rounded-lg border border-border bg-secondary/40 p-4">
              <p className="mb-1 text-sm font-semibold text-viral-accent">Diagnóstico</p>
              <p className="text-sm leading-relaxed text-foreground">{result.verdict}</p>
            </div>

            <Button onClick={reset} variant="secondary" className="mt-3 w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Analisar outro vídeo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
