import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityState {
  largeText: boolean;
  highContrast: boolean;
}

interface AccessibilityContextValue extends AccessibilityState {
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

const STORAGE_KEY = "sc_a11y";

const load = (): AccessibilityState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { largeText: false, highContrast: false };
};

const save = (s: AccessibilityState) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AccessibilityState>(load);

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", state.largeText);
    document.documentElement.classList.toggle("high-contrast", state.highContrast);
    save(state);
  }, [state]);

  const toggleLargeText = () => setState((s) => ({ ...s, largeText: !s.largeText }));
  const toggleHighContrast = () => setState((s) => ({ ...s, highContrast: !s.highContrast }));

  return (
    <AccessibilityContext.Provider value={{ ...state, toggleLargeText, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be within AccessibilityProvider");
  return ctx;
};
