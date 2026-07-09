import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

type MetricTone = "positive" | "negative" | "neutral";

type MetricProps = {
  label: string;
  value: ReactNode;
  change?: string;
  tone?: MetricTone;
  icon?: ReactNode;
  className?: string;
};

const toneClasses: Record<MetricTone, string> = {
  positive: "text-emerald-300",
  negative: "text-rose-300",
  neutral: "text-slate-400",
};

export function Metric({ label, value, change, tone = "neutral", icon, className }: MetricProps) {
  const ChangeIcon = tone === "positive" ? ArrowUpRight : tone === "negative" ? ArrowDownRight : Minus;

  return (
    <div className={cn("rounded-[24px] border border-white/10 bg-white/[0.03] p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
        {icon ? <div className="text-slate-400">{icon}</div> : null}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>
      {change ? (
        <div className={cn("mt-2 inline-flex items-center gap-1 text-sm font-medium", toneClasses[tone])}>
          <ChangeIcon className="h-4 w-4" />
          {change}
        </div>
      ) : null}
    </div>
  );
}
