import type { ReactNode } from "react";

export function DashboardWidget({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#173047] bg-gradient-to-br from-[#071827] to-[#0b1e30] p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-500/70 hover:shadow-[0_20px_60px_rgba(31,140,255,0.15)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}
