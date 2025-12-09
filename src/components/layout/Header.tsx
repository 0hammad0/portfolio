"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/constants/siteConfig";
import { Search } from "lucide-react";
import { useSound } from "@/providers/SoundProvider";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { playSound } = useSound();
  const { navigateToSection } = useSectionNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound("click");
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-4 sm:py-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "mx-auto max-w-4xl",
          "rounded-xl sm:rounded-2xl",
          // Glassmorphism effect
          "bg-background/60 dark:bg-background/40",
          "backdrop-blur-xl backdrop-saturate-150",
          // Border with subtle glow
          "border border-white/20 dark:border-white/10",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          // Transition for scroll state
          "transition-all duration-300",
          isScrolled && "bg-background/80 dark:bg-background/60 shadow-xl"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLogoClick}
          >
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/25 group-hover:shadow-accent/40 transition-shadow">
                <span className="text-white font-bold text-sm">
                  {siteConfig.author.name.charAt(0)}
                </span>
              </div>
            </div>
            {/* Logo Text */}
            <span className="hidden sm:block font-semibold text-foreground group-hover:text-accent transition-colors">
              {siteConfig.author.name.split(" ")[0].toLowerCase()}
            </span>
          </a>

          {/* Desktop Navigation - Center */}
          <Navigation />

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search/Command Palette Trigger */}
            <button
              onClick={() => {
                playSound("click");
                // Dispatch keyboard event to open command palette
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                document.dispatchEvent(event);
              }}
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "bg-foreground/5 border border-transparent",
                "text-foreground-muted text-sm",
                "hover:border-accent/30 transition-colors",
                "cursor-pointer"
              )}
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-foreground/5 text-[10px] font-mono">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle - visible on all screens */}
            <ThemeToggle />

            {/* CTA Button - Desktop */}
            <a
              href="#contact"
              onClick={(e) => navigateToSection(e, "contact")}
              className={cn(
                "hidden md:flex items-center gap-2",
                "px-4 py-2 rounded-xl",
                "bg-accent hover:bg-accent-hover",
                "text-white text-sm font-medium",
                "transition-all duration-200",
                "hover:shadow-lg hover:shadow-accent/25",
                "cursor-pointer"
              )}
            >
              Contact
            </a>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </motion.nav>
    </header>
  );
}
