"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import { useSound } from "@/providers/SoundProvider";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  enableSound?: boolean;
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
      onClick,
      ...props
    },
    ref
  ) => {
    const { playSound } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableSound) {
        playSound("click");
      }
      onClick?.(e);
    };
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg cursor-pointer";

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

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
