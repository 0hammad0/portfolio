"use client";

import { forwardRef, ButtonHTMLAttributes, useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import { useSound } from "@/providers/SoundProvider";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  enableSound?: boolean;
  enableRipple?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      enableSound = true,
      enableRipple = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const { playSound } = useSound();
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple: Ripple = {
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, ripple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableRipple && !disabled && !isLoading) {
        createRipple(e);
      }
      if (enableSound) {
        playSound("click");
      }
      onClick?.(e);
    };

    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg cursor-pointer overflow-hidden";

    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-hover active:scale-[0.98]",
      secondary:
        "bg-background-secondary text-foreground border border-border hover:bg-background-tertiary active:scale-[0.98]",
      ghost:
        "text-foreground hover:bg-background-tertiary active:scale-[0.98]",
      outline:
        "border border-accent text-accent hover:bg-accent hover:text-white active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm gap-1.5",
      md: "h-11 px-5 text-base gap-2",
      lg: "h-13 px-7 text-lg gap-2.5",
    };

    const rippleColor = variant === "primary" || variant === "outline"
      ? "bg-white/30"
      : "bg-accent/20";

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {enableRipple && ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={cn(
              "absolute rounded-full pointer-events-none animate-ripple",
              rippleColor
            )}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "200%",
              height: "200%",
            }}
          />
        ))}

        {/* Button content */}
        {isLoading ? (
          <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="relative z-10">{leftIcon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon && <span className="relative z-10">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
