import { securityEvents } from "../mock-data";

export function SecuritySummaryCards() {
  const warnings = securityEvents.filter((event) => event.status === "Warning").length;
  const blocked = securityEvents.filter((event) => event.status === "Blocked").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Security Events" value={securityEvents.length.toString()} />
      <Card title="Warnings" value={warnings.toString()} />
      <Card title="Blocked" value={blocked.toString()} />
      <Card title="Status" value="Secure" />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}
