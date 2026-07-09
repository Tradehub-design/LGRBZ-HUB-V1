import { responsiveChecks } from "../mock-data";

export function ResponsiveSummaryCards() {
  const total = responsiveChecks.length;
  const review = responsiveChecks.filter(
    (item) =>
      item.mobile === "Needs Review" ||
      item.tablet === "Needs Review" ||
      item.desktop === "Needs Review"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Areas Checked" value={total.toString()} />
      <Card title="Needs Review" value={review.toString()} />
      <Card title="Mobile Status" value="Ready" />
      <Card title="Desktop Status" value="Ready" />
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