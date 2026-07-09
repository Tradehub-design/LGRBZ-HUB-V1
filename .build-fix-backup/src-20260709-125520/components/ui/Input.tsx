import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block space-y-2" htmlFor={inputId}>
        {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition",
            "placeholder:text-slate-500",
            "focus:border-white/25 focus:bg-slate-900/70 focus:ring-2 focus:ring-white/10",
            error && "border-rose-400/40 focus:border-rose-400/60 focus:ring-rose-400/10",
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs text-rose-300">{error}</span> : hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";
