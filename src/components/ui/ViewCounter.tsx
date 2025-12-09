"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ViewCounterProps {
  slug: string;
  className?: string;
  showIcon?: boolean;
  incrementOnMount?: boolean;
}

export function ViewCounter({
  slug,
  className,
  showIcon = true,
  incrementOnMount = true,
}: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function trackView() {
      try {
        if (incrementOnMount) {
          // Increment view
          const res = await fetch(`/api/blog/${slug}/views`, {
            method: "POST",
          });
          if (res.ok) {
            const data = await res.json();
            setViews(data.views);
          }
        } else {
          // Just get view count
          const res = await fetch(`/api/blog/${slug}/views`);
          if (res.ok) {
            const data = await res.json();
            setViews(data.views);
          }
        }
      } catch (error) {
        console.error("Failed to track view:", error);
      } finally {
        setIsLoading(false);
      }
    }

    trackView();
  }, [slug, incrementOnMount]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1.5 text-foreground-muted", className)}>
        {showIcon && <Eye className="h-4 w-4" />}
        <span className="w-8 h-4 bg-background-tertiary animate-pulse rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center gap-1.5 text-foreground-muted text-sm", className)}
    >
      {showIcon && <Eye className="h-4 w-4" />}
      <motion.span
        key={views}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="tabular-nums"
      >
        {formatViews(views ?? 0)} views
      </motion.span>
    </motion.div>
  );
}

// Format views with K/M suffix
function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

// Compact view counter for cards
export function ViewCounterCompact({ views, className }: { views: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 text-foreground-muted text-xs", className)}>
      <Eye className="h-3 w-3" />
      <span className="tabular-nums">{formatViews(views)}</span>
    </div>
  );
}
