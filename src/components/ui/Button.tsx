"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_16px_40px_rgba(255,255,255,0.08)] hover:bg-slate-100",
  secondary:
    "bg-slate-900/80 text-slate-100 ring-1 ring-white/10 hover:bg-slate-800",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger:
    "bg-rose-500/90 text-white shadow-[0_14px_40px_rgba(244,63,94,0.22)] hover:bg-rose-400",
  success:
    "bg-emerald-500/90 text-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.22)] hover:bg-emerald-400",
  outline:
    "bg-transparent text-slate-200 ring-1 ring-white/15 hover:bg-white/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-xl px-3 text-xs",
  md: "h-10 rounded-2xl px-4 text-sm",
  lg: "h-12 rounded-2xl px-5 text-sm",
  icon: "h-10 w-10 rounded-2xl p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 font-medium tracking-[-0.01em] transition-all duration-200",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {size !== "icon" ? children : <span className="sr-only">{children}</span>}
        {!loading ? rightIcon : null}
      </button>
    );
  },
);

Button.displayName = "Button";
