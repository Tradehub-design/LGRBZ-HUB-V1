import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "green" | "red" | "amber" | "blue" | "purple";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-white/8 text-slate-300 ring-white/10",
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/20",
  red: "bg-rose-400/10 text-rose-300 ring-rose-300/20",
  amber: "bg-amber-400/10 text-amber-300 ring-amber-300/20",
  blue: "bg-sky-400/10 text-sky-300 ring-sky-300/20",
  purple: "bg-violet-400/10 text-violet-300 ring-violet-300/20",
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
