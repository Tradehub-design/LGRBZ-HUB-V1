import { cn } from "@/lib/cn";

type StatusTone = "green" | "red" | "amber" | "blue" | "neutral";

const toneClasses: Record<StatusTone, string> = {
  green: "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.65)]",
  red: "bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.65)]",
  amber: "bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.65)]",
  blue: "bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.65)]",
  neutral: "bg-slate-500",
};

type StatusDotProps = {
  tone?: StatusTone;
  className?: string;
};

export function StatusDot({ tone = "neutral", className }: StatusDotProps) {
  return <span className={cn("inline-flex h-2.5 w-2.5 rounded-full", toneClasses[tone], className)} />;
}
