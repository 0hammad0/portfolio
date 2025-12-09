"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  User,
  FolderKanban,
  BookOpen,
  Mail,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { socialLinks } from "@/lib/constants/social";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/constants/siteConfig";
import { cn } from "@/lib/utils/cn";
import { useSound } from "@/providers/SoundProvider";

// Navigation items with icons
const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Sparkles },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Blog", href: "#blog", icon: BookOpen },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { playSound } = useSound();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    playSound("click");
    const targetId = href.replace("#", "");
    setIsOpen(false);

    if (isHomePage) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      // Store section to scroll to after navigation
      sessionStorage.setItem("scrollToSection", targetId);
      setTimeout(() => {
        router.push("/");
      }, 300);
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => {
          playSound("click");
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer",
          "hover:bg-foreground/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-[85vw] max-w-sm z-50 shadow-2xl"
              style={{ backgroundColor: 'var(--background)' }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border">
                  <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/25">
                        <span className="text-white font-bold text-lg">
                          {siteConfig.author.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{siteConfig.author.name.split(" ")[0]}</p>
                        <p className="text-xs text-foreground-muted">{siteConfig.author.role}</p>
                      </div>
                    </div>
                    {/* Close button */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5 text-foreground-muted" />
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <a
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="group flex items-center gap-4 px-4 py-3.5 text-foreground rounded-xl hover:bg-accent/10 transition-all cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-lg bg-background-tertiary group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                              <Icon className="h-5 w-5 text-foreground-muted group-hover:text-accent transition-colors" />
                            </div>
                            <span className="flex-1 font-medium group-hover:text-accent transition-colors">
                              {item.label}
                            </span>
                            <ChevronRight className="h-4 w-4 text-foreground-muted/50 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                          </a>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.05 + 0.1 }}
                    className="mt-6 px-2"
                  >
                    <a
                      href="#contact"
                      onClick={(e) => handleNavClick(e, "#contact")}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-accent to-accent/80 text-white hover:shadow-lg hover:shadow-accent/25 transition-all cursor-pointer"
                    >
                      <Mail className="h-5 w-5" />
                      Get in Touch
                    </a>
                  </motion.div>
                </nav>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-border bg-background-secondary/50">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-foreground-muted">Theme</span>
                    <ThemeToggle />
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-muted">Connect</span>
                    <div className="flex gap-2">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-tertiary hover:bg-accent hover:text-white transition-colors cursor-pointer"
                            aria-label={social.label}
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
