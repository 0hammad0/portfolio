"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { SoundProvider } from "./SoundProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NoiseOverlayCSS } from "@/components/ui/NoiseOverlay";
import { CommandPalette } from "@/components/interactive/CommandPalette";
import { Terminal, TerminalToggle } from "@/components/interactive/Terminal";
import { AccessibilityPanel, AccessibilityButton } from "@/components/ui/AccessibilityPanel";

// Handles scrolling to hash sections when navigating from other pages
function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const scrollToElement = (id: string) => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    };

    // Check sessionStorage for pending scroll (from cross-page navigation)
    const pendingSection = sessionStorage.getItem("scrollToSection");
    if (pendingSection) {
      sessionStorage.removeItem("scrollToSection");
      scrollToElement(pendingSection);
      return;
    }

    // Check URL hash for direct navigation
    const hash = window.location.hash;
    if (hash) {
      scrollToElement(hash.slice(1));
    }
  }, [pathname]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <SoundProvider>
          {/* Handle hash-based navigation scrolling */}
          <HashScrollHandler />

          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>

          {children}

          {/* Global overlays and UI elements */}
          <NoiseOverlayCSS opacity={0.02} />
          <CustomCursor />

          {/* Command Palette (Cmd+K) - handles keyboard shortcuts */}
          <CommandPalette
            onToggleTerminal={() => setTerminalOpen(prev => !prev)}
          />

          {/* Terminal */}
          <Terminal
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
          />
          <TerminalToggle onClick={() => setTerminalOpen((prev) => !prev)} />

          {/* Accessibility Panel */}
          <AccessibilityPanel
            isOpen={accessibilityOpen}
            onClose={() => setAccessibilityOpen(false)}
          />
          <AccessibilityButton onClick={() => setAccessibilityOpen(true)} />
        </SoundProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
