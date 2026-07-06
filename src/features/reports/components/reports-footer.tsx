import { reports } from "../mock-data";

export function ReportsFooter() {
  const completed = reports.filter((report) => report.status === "Completed").length;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Reports" value={reports.length.toString()} />
        <Metric title="Completed" value={completed.toString()} />
        <Metric title="Templates" value="5" />
        <Metric title="Schedules" value="3" />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
