import React from "react";
export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "green" | "blue" | "amber" | "rose" | "purple" | "neutral";
}) {
  const tones = {
    green: "bg-emerald-500/10 text-emerald-300",
    blue: "bg-sky-500/10 text-sky-300",
    amber: "bg-amber-500/10 text-amber-300",
    rose: "bg-rose-500/10 text-rose-300",
    purple: "bg-violet-500/10 text-violet-300",
    neutral: "bg-slate-500/10 text-slate-300",
  };

  return <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
