import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type TextSize = "small" | "medium" | "large";

interface AccessibilityState {
  largeText: boolean; // legacy compat
  highContrast: boolean;
  reducedMotion: boolean;
  textSize: TextSize;
}

interface AccessibilityContextValue extends AccessibilityState {
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setTextSize: (size: TextSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

const STORAGE_KEY = "sc_a11y";

const TEXT_SIZE_PX: Record<TextSize, number> = { small: 16, medium: 18, large: 20 };

const load = (): AccessibilityState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        largeText: parsed.largeText ?? false,
        highContrast: parsed.highContrast ?? false,
        reducedMotion: parsed.reducedMotion ?? false,
        textSize: parsed.textSize ?? "medium",
      };
    }
  } catch {}
  return { largeText: false, highContrast: false, reducedMotion: false, textSize: "medium" };
};

const save = (s: AccessibilityState) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AccessibilityState>(load);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("large-text", state.largeText || state.textSize === "large");
    root.classList.toggle("high-contrast", state.highContrast);
    root.classList.toggle("reduced-motion", state.reducedMotion);
    root.style.setProperty("--base-font-size", `${TEXT_SIZE_PX[state.textSize]}px`);
    save(state);
  }, [state]);

  const toggleLargeText = () => setState((s) => ({ ...s, largeText: !s.largeText }));
  const toggleHighContrast = () => setState((s) => ({ ...s, highContrast: !s.highContrast }));
  const toggleReducedMotion = () => setState((s) => ({ ...s, reducedMotion: !s.reducedMotion }));
  const setTextSize = (size: TextSize) => setState((s) => ({ ...s, textSize: size }));

  return (
    <AccessibilityContext.Provider value={{ ...state, toggleLargeText, toggleHighContrast, toggleReducedMotion, setTextSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be within AccessibilityProvider");
  return ctx;
};
