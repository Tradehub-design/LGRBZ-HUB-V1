import { dataTables } from "../mock-data";

export function AdminSummaryCards() {
  const totalRows = dataTables.reduce((sum, table) => sum + table.rows, 0);
  const review = dataTables.filter((table) => table.status === "Needs Review").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Data Tables" value={dataTables.length.toString()} />
      <Card title="Total Records" value={totalRows.toString()} />
      <Card title="Review Items" value={review.toString()} />
      <Card title="System Status" value="Healthy" />
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
