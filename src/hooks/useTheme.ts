"use client";

import { useContext } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";

// Default values for SSR/when outside provider
const defaultThemeContext = {
  theme: "system" as const,
  setTheme: () => {},
  resolvedTheme: "dark" as const,
};

export function useTheme() {
  const context = useContext(ThemeContext);

  // Return default values if outside provider (SSR safety)
  if (context === undefined) {
    return defaultThemeContext;
  }

  return context;
}
