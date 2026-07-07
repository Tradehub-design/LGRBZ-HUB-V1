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
  primary: "bg-[#1f8cff] text-white shadow-[0_10px_28px_rgba(31,140,255,0.28)] hover:bg-sky-500",
  secondary: "bg-[#0b1e30] text-slate-100 ring-1 ring-[#173047] hover:border-sky-600 hover:bg-[#10263b]",
  ghost: "bg-transparent text-slate-300 hover:bg-[#10263b] hover:text-white",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
  success: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  outline: "bg-transparent text-slate-200 ring-1 ring-[#173047] hover:bg-[#10263b]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-xs",
  md: "h-10 rounded-lg px-4 text-sm",
  lg: "h-12 rounded-xl px-5 text-sm",
  icon: "h-10 w-10 rounded-lg p-0",
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
          "inline-flex shrink-0 items-center justify-center gap-2 font-medium transition",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
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
