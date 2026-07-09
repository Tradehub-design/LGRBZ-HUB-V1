import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-3 text-3xl font-bold text-slate-950">
        {value}
      </div>

      {subtitle && (
        <div className="mt-2 text-sm text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}
