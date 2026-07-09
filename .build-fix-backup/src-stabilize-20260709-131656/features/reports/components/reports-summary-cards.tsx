import { reports } from "../mock-data";

export function ReportsSummaryCards() {
  const completed = reports.filter((report) => report.status === "Completed").length;
  const pdf = reports.filter((report) => report.format === "PDF").length;
  const excel = reports.filter((report) => report.format === "Excel").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Reports" value={reports.length.toString()} />
      <Card title="Completed" value={completed.toString()} />
      <Card title="PDF Reports" value={pdf.toString()} />
      <Card title="Excel Reports" value={excel.toString()} />
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
