"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  User,
  FolderKanban,
  BookOpen,
  Mail,
  Moon,
  Sun,
  Monitor,
  Terminal,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/providers/SoundProvider";
import { cn } from "@/lib/utils/cn";

interface CommandPaletteProps {
  onToggleTerminal?: () => void;
}

const navigationItems = [
  { name: "Home", icon: Home, href: "#home", shortcut: "G H" },
  { name: "About", icon: User, href: "#about", shortcut: "G A" },
  { name: "Skills", icon: Sparkles, href: "#skills", shortcut: "G S" },
  { name: "Projects", icon: FolderKanban, href: "#projects", shortcut: "G P" },
  { name: "Blog", icon: BookOpen, href: "/blog", shortcut: "G B" },
  { name: "Contact", icon: Mail, href: "#contact", shortcut: "G C" },
];

export function CommandPalette({
  onToggleTerminal,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, playSound } = useSound();

  // Cycle theme helper
  const cycleTheme = useCallback(() => {
    const themes: Array<"system" | "dark" | "light"> = ["system", "dark", "light"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    playSound("toggle");
  }, [theme, setTheme, playSound]);

  // Global keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Cmd/Ctrl + K - Command palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        return;
      }

      // Escape to close
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      // Skip other shortcuts if typing
      if (isInput) return;

      // T - Toggle theme (only when not in command palette)
      if (e.key === "t" || e.key === "T") {
        if (!open) {
          e.preventDefault();
          cycleTheme();
        }
        return;
      }

      // ` (backtick) - Toggle terminal
      if (e.key === "`" && onToggleTerminal) {
        e.preventDefault();
        onToggleTerminal();
        playSound("whoosh");
        return;
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, cycleTheme, onToggleTerminal, playSound]);

  const navigateTo = useCallback(
    (href: string) => {
      setOpen(false);
      if (href.startsWith("#")) {
        const element = document.getElementById(href.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push("/" + href);
        }
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const handleToggleTerminal = useCallback(() => {
    setOpen(false);
    playSound("whoosh");
    // Small delay to let the command palette close animation start
    setTimeout(() => {
      if (onToggleTerminal) {
        onToggleTerminal();
      }
    }, 100);
  }, [onToggleTerminal, playSound]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
    setOpen(false);
  }, [soundEnabled, setSoundEnabled]);

  const handleCycleTheme = useCallback(() => {
    cycleTheme();
    setOpen(false);
  }, [cycleTheme]);

  return (
    <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setOpen(false)}
            />

            {/* Command Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 z-[101] w-full max-w-lg"
            >
              <Command
                className={cn(
                  "rounded-xl overflow-hidden",
                  "bg-background border border-border",
                  "shadow-2xl shadow-black/20"
                )}
              >
                {/* Search input */}
                <div className="flex items-center gap-2 px-4 border-b border-border">
                  <Search className="h-4 w-4 text-foreground-muted shrink-0" />
                  <Command.Input
                    placeholder="Type a command or search..."
                    className={cn(
                      "flex-1 py-4 bg-transparent",
                      "text-foreground placeholder:text-foreground-muted",
                      "focus:outline-none"
                    )}
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded hover:bg-background-secondary transition-colors"
                  >
                    <X className="h-4 w-4 text-foreground-muted" />
                  </button>
                </div>

                {/* Commands list */}
                <Command.List className="max-h-80 overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-foreground-muted text-sm">
                    No results found.
                  </Command.Empty>

                  {/* Navigation */}
                  <Command.Group heading="Navigation" className="mb-2">
                    <div className="px-2 py-1.5 text-xs text-foreground-muted font-medium">
                      Navigation
                    </div>
                    {navigationItems.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={item.name}
                        onSelect={() => navigateTo(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                          "text-foreground-muted",
                          "hover:bg-accent/10 hover:text-foreground",
                          "data-[selected=true]:bg-accent/10 data-[selected=true]:text-foreground",
                          "transition-colors"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.name}</span>
                        <kbd className="text-xs text-foreground-muted/50 font-mono">
                          {item.shortcut}
                        </kbd>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {/* Theme */}
                  <Command.Group heading="Theme">
                    <div className="px-2 py-1.5 text-xs text-foreground-muted font-medium">
                      Theme
                    </div>
                    <Command.Item
                      value="Toggle theme"
                      onSelect={handleCycleTheme}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                        "text-foreground-muted",
                        "hover:bg-accent/10 hover:text-foreground",
                        "data-[selected=true]:bg-accent/10 data-[selected=true]:text-foreground",
                        "transition-colors"
                      )}
                    >
                      {theme === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : theme === "light" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Monitor className="h-4 w-4" />
                      )}
                      <span className="flex-1">
                        Toggle theme (current: {theme})
                      </span>
                      <kbd className="text-xs text-foreground-muted/50 font-mono">
                        T
                      </kbd>
                    </Command.Item>
                  </Command.Group>

                  {/* Actions */}
                  <Command.Group heading="Actions">
                    <div className="px-2 py-1.5 text-xs text-foreground-muted font-medium">
                      Actions
                    </div>
                    <Command.Item
                      value="Open terminal"
                      onSelect={handleToggleTerminal}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                        "text-foreground-muted",
                        "hover:bg-accent/10 hover:text-foreground",
                        "data-[selected=true]:bg-accent/10 data-[selected=true]:text-foreground",
                        "transition-colors"
                      )}
                    >
                      <Terminal className="h-4 w-4" />
                      <span className="flex-1">Open Terminal</span>
                      <kbd className="text-xs text-foreground-muted/50 font-mono">
                        `
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="Toggle sound effects"
                      onSelect={handleToggleSound}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                        "text-foreground-muted",
                        "hover:bg-accent/10 hover:text-foreground",
                        "data-[selected=true]:bg-accent/10 data-[selected=true]:text-foreground",
                        "transition-colors"
                      )}
                    >
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      <span className="flex-1">
                        {soundEnabled ? "Disable" : "Enable"} Sound Effects
                      </span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-foreground-muted">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-background-tertiary font-mono">
                        ↑↓
                      </kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-background-tertiary font-mono">
                        ↵
                      </kbd>
                      Select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-background-tertiary font-mono">
                      Esc
                    </kbd>
                    Close
                  </span>
                </div>
              </Command>
            </motion.div>
          </>
        )}
    </AnimatePresence>
  );
}
