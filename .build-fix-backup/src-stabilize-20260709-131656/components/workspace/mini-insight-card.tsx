import type { ReactNode } from "react";

export function MiniInsightCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#173047] bg-[#0b1e30] p-4 transition hover:border-sky-600">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <p className="mt-1 text-xl font-semibold text-white">{value}</p>
          {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
        </div>
        {icon ? <div className="text-sky-300">{icon}</div> : null}
      </div>
    </div>
  );
}
