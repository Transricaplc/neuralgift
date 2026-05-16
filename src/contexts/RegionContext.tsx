import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  REGIONS,
  REGION_BY_CODE,
  FALLBACK_REGION,
  detectRegionFromBrowser,
  type Region,
} from "@/data/regions";

const STORAGE_KEY = "ng_region_v3";

type RegionContextValue = {
  region: Region;
  setRegion: (code: string) => void;
  isDetected: boolean;
  allRegions: Region[];
  selectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
};

const Ctx = createContext<RegionContextValue | null>(null);

function readUrlRegion(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("region");
  return code && REGION_BY_CODE[code.toUpperCase()] ? code.toUpperCase() : null;
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  // SSR-safe: start with fallback, hydrate on mount
  const [region, setRegionState] = useState<Region>(FALLBACK_REGION);
  const [isDetected, setIsDetected] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    // Priority: URL param > localStorage > timezone detection
    const urlCode = readUrlRegion();
    if (urlCode) {
      setRegionState(REGION_BY_CODE[urlCode]);
      setIsDetected(false);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && REGION_BY_CODE[stored]) {
        setRegionState(REGION_BY_CODE[stored]);
        setIsDetected(false);
        return;
      }
    } catch {
      // ignore
    }
    const detected = detectRegionFromBrowser();
    setRegionState(detected);
    setIsDetected(detected.code !== "XX");
  }, []);

  const setRegion = useCallback((code: string) => {
    const next = REGION_BY_CODE[code] ?? FALLBACK_REGION;
    setRegionState(next);
    setIsDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, next.code);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<RegionContextValue>(
    () => ({
      region,
      setRegion,
      isDetected,
      allRegions: REGIONS,
      selectorOpen,
      openSelector: () => setSelectorOpen(true),
      closeSelector: () => setSelectorOpen(false),
    }),
    [region, setRegion, isDetected, selectorOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRegion() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRegion must be used inside <RegionProvider>");
  return ctx;
}