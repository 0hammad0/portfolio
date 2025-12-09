"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSound } from "@/providers/SoundProvider";

export function useSectionNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { playSound } = useSound();

  const navigateToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        playSound("click");
      } catch {
        // Ignore sound errors
      }

      // Remove # if present
      const targetId = sectionId.replace("#", "");

      if (isHomePage) {
        // On homepage, scroll to section directly
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // On other pages, navigate to homepage then scroll
        // Use sessionStorage to signal scroll after navigation
        sessionStorage.setItem("scrollToSection", targetId);
        router.push("/");
      }
    },
    [isHomePage, playSound, router]
  );

  return { navigateToSection, isHomePage };
}
