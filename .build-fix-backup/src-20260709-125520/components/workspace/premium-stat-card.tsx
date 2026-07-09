import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PremiumStatCard({
  label,
  value,
  helper,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  tone?: "blue" | "green" | "purple" | "amber" | "rose";
}) {
  const tones = {
    blue: "bg-blue-500/15 text-blue-300 shadow-blue-500/10",
    green: "bg-emerald-500/15 text-emerald-300 shadow-emerald-500/10",
    purple: "bg-purple-500/15 text-purple-300 shadow-purple-500/10",
    amber: "bg-amber-500/15 text-amber-300 shadow-amber-500/10",
    rose: "bg-rose-500/15 text-rose-300 shadow-rose-500/10",
  };

  return (
    <div className="group rounded-2xl border border-[#173047] bg-[#071827] p-4 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-600/80 hover:bg-[#0b1e30]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-400">{label}</p>

        {icon ? (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full shadow-lg", tones[tone])}>
            <div className="h-5 w-5">{icon}</div>
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-400">{helper}</p> : null}

      <svg viewBox="0 0 180 36" className="mt-4 h-9 w-full opacity-80">
        <path
          d="M2,28 C20,20 30,32 45,22 C58,14 68,24 80,16 C92,9 104,20 118,14 C132,8 146,18 160,11 C170,7 175,10 178,8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={cn(
            tone === "green" && "text-emerald-400",
            tone === "purple" && "text-purple-400",
            tone === "amber" && "text-amber-400",
            tone === "rose" && "text-rose-400",
            tone === "blue" && "text-sky-400",
          )}
        />
      </svg>
    </div>
  );
}
