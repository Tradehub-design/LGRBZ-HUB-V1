"use client";

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function AnimatedKpiCard({
  label,
  value,
  helper,
  icon,
  trend = "neutral",
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}) {
  const trendClass =
    trend === "up"
      ? "text-emerald-300 bg-emerald-500/10"
      : trend === "down"
        ? "text-rose-300 bg-rose-500/10"
        : "text-sky-300 bg-sky-500/10";

  return (
    <div className="group rounded-2xl border border-[#173047] bg-gradient-to-br from-[#071827] to-[#0b1e30] p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-500/70">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${trendClass}`}>
          {icon ?? (trend === "down" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />)}
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>

      {helper ? <p className="mt-2 text-sm text-slate-400">{helper}</p> : null}

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-2/3 rounded-full bg-sky-500 transition-all duration-700 group-hover:w-full" />
      </div>
    </div>
  );
}
