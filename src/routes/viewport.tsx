import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/viewport")({
  component: ViewportPreview,
});

type Preset = {
  id: string;
  label: string;
  width: number;
  height: number;
  note?: string;
};

const PRESETS: Preset[] = [
  { id: "13", label: '13" Laptop', width: 1280, height: 800, note: "MacBook Air 13" },
  { id: "14", label: '14" Laptop', width: 1512, height: 945, note: "MacBook Pro 14" },
  { id: "15", label: '15" Laptop', width: 1440, height: 900, note: "MacBook Pro 15" },
  { id: "16", label: '16" Laptop', width: 1728, height: 1080, note: "MacBook Pro 16" },
  { id: "fhd", label: "Desktop FHD", width: 1920, height: 1080 },
  { id: "qhd", label: "Desktop QHD", width: 2560, height: 1440 },
  { id: "tabL", label: "Tablet Landscape", width: 1180, height: 820, note: "iPad Air" },
  { id: "tabP", label: "Tablet Portrait", width: 820, height: 1180, note: "iPad Air" },
  { id: "mobL", label: "Mobile L", width: 430, height: 932, note: "iPhone 15 Pro Max" },
  { id: "mobM", label: "Mobile M", width: 390, height: 844, note: "iPhone 15" },
  { id: "mobS", label: "Mobile S", width: 360, height: 800, note: "Android" },
];

const ROUTES = [
  "/",
  "/buy",
  "/redeem",
  "/how-it-works",
  "/pricing",
  "/manifesto",
  "/business/landing",
  "/global-access",
  "/studio",
];

function ViewportPreview() {
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [route, setRoute] = useState<string>("/");
  const [scaleToFit, setScaleToFit] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);

  const availableW = typeof window !== "undefined" ? window.innerWidth - 64 : 1200;
  const availableH = typeof window !== "undefined" ? window.innerHeight - 180 : 800;
  const fitScale = Math.min(availableW / preset.width, availableH / preset.height, 1);
  const effectiveScale = scaleToFit ? fitScale * zoom : zoom;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Viewport Preview</h1>
            <p className="text-sm text-muted-foreground">
              Dev-only tool for verifying typography &amp; layout at common screen widths.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground tabular">
            <span>Rendering {preset.width}×{preset.height}</span>
            <span>·</span>
            <span>Scale {Math.round(effectiveScale * 100)}%</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                preset.id === p.id
                  ? "bg-indigo text-indigo-foreground border-indigo"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-indigo/40"
              }`}
              title={p.note ?? `${p.width}×${p.height}`}
            >
              {p.label}
              <span className="ml-1.5 opacity-60 tabular">{p.width}</span>
            </button>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          <label className="text-xs text-muted-foreground">Route</label>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs"
          >
            {ROUTES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <label className="text-xs text-muted-foreground ml-4 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={scaleToFit}
              onChange={(e) => setScaleToFit(e.target.checked)}
            />
            Fit to window
          </label>

          <label className="text-xs text-muted-foreground ml-4 inline-flex items-center gap-2">
            Zoom
            <input
              type="range"
              min={0.25}
              max={1.5}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <span className="tabular w-10">{Math.round(zoom * 100)}%</span>
          </label>

          <button
            onClick={() => {
              setZoom(1);
              setScaleToFit(true);
            }}
            className="ml-auto text-xs px-3 py-1 rounded-md border border-border hover:bg-elevated"
          >
            Reset
          </button>
        </div>

        <div
          className="bg-elevated/40 border border-border rounded-xl overflow-hidden mx-auto"
          style={{
            width: preset.width * effectiveScale,
            height: preset.height * effectiveScale,
          }}
        >
          <div
            style={{
              width: preset.width,
              height: preset.height,
              transform: `scale(${effectiveScale})`,
              transformOrigin: "top left",
            }}
          >
            <iframe
              key={`${preset.id}-${route}`}
              src={route}
              title={`Preview ${preset.label} ${route}`}
              style={{
                width: preset.width,
                height: preset.height,
                border: "0",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
