"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "./Container";
import { socialLinks } from "@/lib/constants/social";
import { siteConfig } from "@/lib/constants/siteConfig";
import { ArrowUp, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/providers/SoundProvider";

function FooterComponent() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { playSound } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNavClick = useCallback((targetId: string) => {
    playSound("click");

    if (isHomePage) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollToSection", targetId);
      router.push("/");
    }
  }, [isHomePage, playSound, router]);

  return (
    <footer className="relative bg-background-secondary border-t border-border">
      <Container>
        <div className="py-8 sm:py-12 md:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {/* Brand */}
            <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold">{siteConfig.author.name}</h3>
              <p className="text-foreground-muted text-xs sm:text-sm max-w-xs mx-auto sm:mx-0">
                {siteConfig.description}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
              <h4 className="font-semibold text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2 flex flex-wrap justify-center sm:justify-start sm:flex-col gap-x-4 sm:gap-x-0">
                {["About", "Projects", "Blog", "Contact"].map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(link.toLowerCase())}
                      className="text-foreground-muted hover:text-accent transition-colors text-xs sm:text-sm cursor-pointer min-h-11 sm:min-h-0 inline-flex items-center"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-3 sm:space-y-4 text-center sm:text-left sm:col-span-2 md:col-span-1">
              <h4 className="font-semibold text-sm sm:text-base">Connect</h4>
              <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 sm:p-2 rounded-lg bg-background-tertiary text-foreground-muted hover:bg-accent hover:text-white transition-all cursor-pointer min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 sm:my-8 border-t border-border" />

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-foreground-muted flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-error fill-error" /> by{" "}
              <span className="text-foreground">{siteConfig.author.name}</span>
            </p>

            <p className="text-xs sm:text-sm text-foreground-muted">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </Container>

      {/* Back to Top Button - at bottom right, accessibility button moves up when this appears */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-accent text-white rounded-full shadow-lg hover:bg-accent-hover transition-colors z-40 cursor-pointer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

// Memoize to prevent unnecessary re-renders
export const Footer = memo(FooterComponent);
