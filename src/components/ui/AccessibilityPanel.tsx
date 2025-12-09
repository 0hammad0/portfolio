"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Type,
  Contrast,
  Volume2,
  VolumeX,
  X,
  Check,
} from "lucide-react";
import { useAccessibility } from "@/providers/AccessibilityProvider";
import { useSound } from "@/providers/SoundProvider";
import { cn } from "@/lib/utils/cn";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const fontSizeOptions = [
  { value: "small", label: "Small", size: "14px" },
  { value: "medium", label: "Medium", size: "16px" },
  { value: "large", label: "Large", size: "18px" },
] as const;

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useSound();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-sm z-[101] bg-background border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Accessibility className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Accessibility</h2>
                  <p className="text-xs text-foreground-muted">Customize your experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
              >
                <X className="h-5 w-5 text-foreground-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Font Size */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-foreground">Font Size</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFontSize(option.value)}
                      className={cn(
                        "relative px-4 py-3 rounded-lg border transition-all",
                        fontSize === option.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/50 text-foreground-muted hover:text-foreground"
                      )}
                    >
                      <span
                        className="font-medium"
                        style={{ fontSize: option.size }}
                      >
                        Aa
                      </span>
                      <span className="block text-xs mt-1">{option.label}</span>
                      {fontSize === option.value && (
                        <motion.div
                          layoutId="fontSizeIndicator"
                          className="absolute top-1 right-1"
                        >
                          <Check className="h-3 w-3 text-accent" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Contrast className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-foreground">High Contrast</h3>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                    highContrast
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <span className="text-foreground-muted">
                    {highContrast ? "Enabled" : "Disabled"}
                  </span>
                  <div
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      highContrast ? "bg-accent" : "bg-background-tertiary"
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      animate={{ left: highContrast ? "calc(100% - 20px)" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>
                <p className="text-xs text-foreground-muted mt-2">
                  Increase contrast for better readability
                </p>
              </div>

              {/* Sound Effects */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-accent" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-accent" />
                  )}
                  <h3 className="font-medium text-foreground">Sound Effects</h3>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                    soundEnabled
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <span className="text-foreground-muted">
                    {soundEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <div
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      soundEnabled ? "bg-accent" : "bg-background-tertiary"
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      animate={{ left: soundEnabled ? "calc(100% - 20px)" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>
                <p className="text-xs text-foreground-muted mt-2">
                  Play subtle sounds on interactions
                </p>
              </div>

              {/* Keyboard shortcuts info */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-medium text-foreground mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Open command palette</span>
                    <kbd className="px-2 py-1 rounded bg-background-tertiary text-xs font-mono">
                      ⌘K
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Open terminal</span>
                    <kbd className="px-2 py-1 rounded bg-background-tertiary text-xs font-mono">
                      `
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Toggle theme</span>
                    <kbd className="px-2 py-1 rounded bg-background-tertiary text-xs font-mono">
                      T
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Floating accessibility button - at bottom right, moves up when scroll-to-top is visible
export function AccessibilityButton({ onClick }: { onClick: () => void }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position to know when scroll-to-top button appears
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed right-4 sm:right-6 z-[50]",
        "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
        "bg-background-secondary border border-border",
        "flex items-center justify-center",
        "hover:border-accent/50 hover:bg-accent/10",
        "transition-all duration-300 cursor-pointer",
        "shadow-lg"
      )}
      animate={{
        bottom: showScrollTop ? 88 : 16, // Move up when scroll-to-top is visible
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Accessibility Settings"
      aria-label="Open accessibility settings"
    >
      <Accessibility className="h-5 w-5 text-foreground-muted" />
    </motion.button>
  );
}
