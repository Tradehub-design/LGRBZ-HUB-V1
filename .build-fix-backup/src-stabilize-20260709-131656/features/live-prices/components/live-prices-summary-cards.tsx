import { livePrices } from "../mock-data";

export function LivePricesSummaryCards() {
  const live = livePrices.filter((row) => row.status === "Live").length;
  const delayed = livePrices.filter((row) => row.status === "Delayed").length;
  const positive = livePrices.filter((row) => row.change >= 0).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Tracked Symbols" value={livePrices.length.toString()} />
      <Card title="Live Feeds" value={live.toString()} />
      <Card title="Delayed Feeds" value={delayed.toString()} />
      <Card title="Positive Today" value={positive.toString()} />
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
