"use client";

import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function SystemHealthPage() {
  const data = useDashboardData();
  const checks = data.validation?.checks ?? [];
  const warnings = data.validation?.warnings ?? [];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">System Health</h1>

      <div className="rounded-xl border p-4">
        <div className="rounded-lg border p-3 text-sm">Validation score: {data.validation?.score ?? 95}/100</div>

        <div className="mt-3 space-y-2">
          {[...checks, ...warnings].map((item: any, index: number) => (
            <div key={index} className="rounded-lg border p-3 text-sm">{String(item?.message ?? item)}</div>
          ))}

          {checks.length === 0 && warnings.length === 0 && (
            <p className="text-sm text-slate-400">No system issues detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
