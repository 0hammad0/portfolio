"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
  currentValue?: string; // For character count display when using uncontrolled (react-hook-form)
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCount, maxLength, id, value, currentValue, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    // Use currentValue prop (for react-hook-form) or value prop (for controlled)
    const displayValue = currentValue ?? value;
    const currentLength = typeof displayValue === "string" ? displayValue.length : 0;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={cn(
              "w-full rounded-lg border bg-background-secondary px-4 py-3 text-foreground placeholder:text-foreground-muted",
              "transition-all duration-200 resize-none min-h-[120px]",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-error focus:ring-error"
                : "border-border hover:border-foreground-muted",
              className
            )}
            {...props}
          />
        </div>
        <div className="flex justify-between items-center">
          {error && (
            <p className="text-sm text-error">{error}</p>
          )}
          {showCount && maxLength && (
            <p className={cn(
              "text-sm ml-auto",
              currentLength > maxLength * 0.9 ? "text-warning" : "text-foreground-muted"
            )}>
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
