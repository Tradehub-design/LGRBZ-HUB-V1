import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "green" | "red" | "amber" | "blue" | "purple";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-slate-500/10 text-slate-300 ring-slate-400/20",
  green: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  red: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
  amber: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  blue: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
  purple: "bg-violet-500/10 text-violet-300 ring-violet-400/20",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  children: ReactNode;
};

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
