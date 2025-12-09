"use client";

import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/providers/SoundProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import type { Theme } from "@/providers/ThemeProvider";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels: Record<Theme, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System preference",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { playSound } = useSound();

  const cycleTheme = () => {
    const themes: Theme[] = ["system", "dark", "light"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    playSound("toggle");
  };

  const Icon = themeIcons[theme];

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative p-2 rounded-lg transition-colors duration-200 cursor-pointer",
        "hover:bg-foreground/5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      aria-label={`Current: ${themeLabels[theme]}. Click to change.`}
      title={themeLabels[theme]}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <Icon className="h-5 w-5 text-foreground" />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
