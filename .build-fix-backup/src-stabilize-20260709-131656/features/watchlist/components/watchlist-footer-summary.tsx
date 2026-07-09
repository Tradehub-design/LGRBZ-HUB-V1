import { watchlistItems } from "../mock-data";

export function WatchlistFooterSummary() {
  const owned = watchlistItems.filter((item) => item.status === "Owned").length;
  const overvalued = watchlistItems.filter(
    (item) => item.status === "Overvalued"
  ).length;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Items" value={watchlistItems.length.toString()} />
        <Metric title="Owned" value={owned.toString()} />
        <Metric title="Overvalued" value={overvalued.toString()} />
        <Metric title="Buy Zone" value="0" />
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
