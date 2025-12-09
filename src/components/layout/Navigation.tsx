"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isBlogPage = pathname.startsWith("/blog");
  const { navigateToSection } = useSectionNavigation();

  useEffect(() => {
    // If on blog pages, highlight Blog nav item
    if (isBlogPage) {
      setActiveSection("blog");
      return;
    }

    if (!isHomePage) {
      setActiveSection("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    navigationItems.forEach((item) => {
      const sectionId = item.href.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHomePage, isBlogPage]);

  return (
    <nav className={cn("hidden md:flex items-center gap-1", className)}>
      {navigationItems.map((item) => {
        const isActive = activeSection === item.href.replace("#", "");

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => navigateToSection(e, item.href)}
            className={cn(
              "relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer",
              isActive
                ? "text-foreground"
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            {item.label}
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-foreground/5 dark:bg-white/10 rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}
