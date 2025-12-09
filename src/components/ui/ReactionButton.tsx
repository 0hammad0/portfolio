"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Flame, Sparkles, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSound } from "@/providers/SoundProvider";

type ReactionType = "like" | "love" | "fire" | "clap";

interface ReactionButtonProps {
  slug: string;
  className?: string;
  showAllReactions?: boolean;
}

const REACTIONS: { type: ReactionType; icon: React.ElementType; label: string; color: string }[] = [
  { type: "like", icon: ThumbsUp, label: "Like", color: "#3b82f6" },
  { type: "love", icon: Heart, label: "Love", color: "#ef4444" },
  { type: "fire", icon: Flame, label: "Fire", color: "#f97316" },
  { type: "clap", icon: Sparkles, label: "Amazing", color: "#eab308" },
];

// Floating particle animation
function FloatingParticle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ backgroundColor: color, left: x, top: y }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [1, 1, 0],
        y: [0, -50],
        x: [0, (Math.random() - 0.5) * 40],
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}

export function ReactionButton({ slug, className, showAllReactions = true }: ReactionButtonProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const { playSound } = useSound();

  // Fetch initial reactions
  useEffect(() => {
    async function fetchReactions() {
      try {
        const res = await fetch(`/api/blog/${slug}/reactions`);
        if (res.ok) {
          const data = await res.json();
          setReactions(data.reactions || {});
          setUserReactions(data.userReactions || []);
          setTotalLikes(data.totalLikes || 0);
        }
      } catch (error) {
        console.error("Failed to fetch reactions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReactions();
  }, [slug]);

  const handleReaction = useCallback(
    async (type: ReactionType, event?: React.MouseEvent) => {
      // Play pop sound
      playSound("pop");

      // Add particle effect
      if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const reaction = REACTIONS.find((r) => r.type === type);
        const newParticle = {
          id: Date.now(),
          x,
          y,
          color: reaction?.color || "#06b6d4",
        };
        setParticles((prev) => [...prev, newParticle]);
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 800);
      }

      // Optimistic update
      const wasReacted = userReactions.includes(type);
      setUserReactions((prev) =>
        wasReacted ? prev.filter((r) => r !== type) : [...prev, type]
      );
      setReactions((prev) => ({
        ...prev,
        [type]: (prev[type] || 0) + (wasReacted ? -1 : 1),
      }));

      try {
        const res = await fetch(`/api/blog/${slug}/reactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });

        if (res.ok) {
          const data = await res.json();
          setReactions(data.reactions || {});
          setTotalLikes(data.totalLikes || 0);
        } else {
          // Revert on error
          setUserReactions((prev) =>
            wasReacted ? [...prev, type] : prev.filter((r) => r !== type)
          );
        }
      } catch (error) {
        console.error("Failed to react:", error);
        // Revert on error
        setUserReactions((prev) =>
          wasReacted ? [...prev, type] : prev.filter((r) => r !== type)
        );
      }

      setShowPicker(false);
    },
    [slug, userReactions, playSound]
  );

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const hasAnyReaction = userReactions.length > 0;

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-24 h-10 bg-background-tertiary animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      {/* Main reaction button */}
      <motion.button
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full",
          "border transition-all duration-200",
          hasAnyReaction
            ? "bg-accent/10 border-accent text-accent"
            : "bg-background-secondary border-border text-foreground-muted hover:border-accent/50 hover:text-foreground"
        )}
        onClick={(e) => handleReaction("like", e)}
        onMouseEnter={() => showAllReactions && setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
        whileTap={{ scale: 0.95 }}
      >
        {/* Particles */}
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}

        <motion.div
          animate={hasAnyReaction ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {userReactions.includes("love") ? (
            <Heart className="h-5 w-5 fill-current" />
          ) : userReactions.includes("fire") ? (
            <Flame className="h-5 w-5" />
          ) : userReactions.includes("clap") ? (
            <Sparkles className="h-5 w-5" />
          ) : (
            <ThumbsUp className={cn("h-5 w-5", hasAnyReaction && "fill-current")} />
          )}
        </motion.div>
        <span className="font-medium tabular-nums">{totalReactions}</span>
      </motion.button>

      {/* Reaction picker */}
      <AnimatePresence>
        {showPicker && showAllReactions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-2 rounded-full bg-background border border-border shadow-xl"
            onMouseEnter={() => setShowPicker(true)}
            onMouseLeave={() => setShowPicker(false)}
          >
            {REACTIONS.map((reaction, index) => {
              const isActive = userReactions.includes(reaction.type);
              const count = reactions[reaction.type] || 0;

              return (
                <motion.button
                  key={reaction.type}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full transition-all",
                    isActive ? "bg-accent/20" : "hover:bg-background-tertiary"
                  )}
                  style={{ color: isActive ? reaction.color : undefined }}
                  onClick={(e) => handleReaction(reaction.type, e)}
                  title={`${reaction.label} (${count})`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <reaction.icon
                    className={cn("h-5 w-5", isActive && "fill-current")}
                  />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-medium">
                      {count > 99 ? "99" : count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple like button variant
export function LikeButton({ slug, className }: { slug: string; className?: string }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { playSound } = useSound();

  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await fetch(`/api/blog/${slug}/reactions`);
        if (res.ok) {
          const data = await res.json();
          setLikes(data.totalLikes || 0);
          setLiked(data.userReactions?.includes("like") || false);
        }
      } catch {
        // Ignore
      } finally {
        setIsLoading(false);
      }
    }
    fetchLikes();
  }, [slug]);

  const handleLike = async () => {
    playSound("pop");
    const wasLiked = liked;
    setLiked(!liked);
    setLikes((prev) => prev + (wasLiked ? -1 : 1));

    try {
      await fetch(`/api/blog/${slug}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "like" }),
      });
    } catch {
      setLiked(wasLiked);
      setLikes((prev) => prev + (wasLiked ? 1 : -1));
    }
  };

  if (isLoading) {
    return <div className="w-16 h-8 bg-background-tertiary animate-pulse rounded-lg" />;
  }

  return (
    <motion.button
      onClick={handleLike}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
        liked
          ? "bg-red-500/10 text-red-500"
          : "bg-background-secondary text-foreground-muted hover:text-red-500",
        className
      )}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}}>
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      </motion.div>
      <span className="tabular-nums">{likes}</span>
    </motion.button>
  );
}
