"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type FontSize = "small" | "medium" | "large";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  keyboardMode: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [highContrast, setHighContrastState] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as FontSize | null;
    const savedHighContrast = localStorage.getItem("highContrast") === "true";

    if (savedFontSize && FONT_SIZE_MAP[savedFontSize]) {
      setFontSizeState(savedFontSize);
    }
    setHighContrastState(savedHighContrast);

    // Check system reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty("--base-font-size", FONT_SIZE_MAP[fontSize]);
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute("data-high-contrast", "true");
    } else {
      document.documentElement.removeAttribute("data-high-contrast");
    }
    localStorage.setItem("highContrast", String(highContrast));
  }, [highContrast]);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setKeyboardMode(true);
        document.documentElement.setAttribute("data-keyboard-mode", "true");
      }
    };

    const handleMouseDown = () => {
      setKeyboardMode(false);
      document.documentElement.removeAttribute("data-keyboard-mode");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setHighContrastState(enabled);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reducedMotion,
        keyboardMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
