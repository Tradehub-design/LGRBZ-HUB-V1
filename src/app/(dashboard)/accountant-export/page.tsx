"use client";

import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function AccountantExportPage() {
  const data = useDashboardData();
  const sections = data.taxExportSummary?.sections ?? [];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Accountant Export</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Export Status" value={data.taxExportSummary?.ready ? "Ready" : "Draft"} />
        <Card label="Sections" value={String(sections.length)} />
        <Card label="Output" value="Pending" />
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold">Export Sections</h2>
        <div className="mt-3 space-y-2">
          {sections.map((section: string) => (
            <div key={section} className="rounded-lg border p-3 text-sm">{section}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
