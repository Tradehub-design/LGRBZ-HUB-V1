import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, id, options, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block space-y-2" htmlFor={inputId}>
        {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition",
            "focus:border-white/25 focus:bg-slate-900/70 focus:ring-2 focus:ring-white/10",
            error && "border-rose-400/40 focus:border-rose-400/60 focus:ring-rose-400/10",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-950 text-white">
              {option.label}
            </option>
          ))}
        </select>
        {error ? <span className="text-xs text-rose-300">{error}</span> : hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </label>
    );
  },
);

Select.displayName = "Select";
