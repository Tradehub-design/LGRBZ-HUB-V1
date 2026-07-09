import { watchlistItems } from "../mock-data";

export function WatchlistSummaryCards() {
  const owned = watchlistItems.filter((item) => item.status === "Owned").length;
  const buyZone = watchlistItems.filter((item) => item.status === "Buy Zone").length;
  const overvalued = watchlistItems.filter((item) => item.status === "Overvalued").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Watchlist Items" value={watchlistItems.length.toString()} />
      <Card title="Owned" value={owned.toString()} />
      <Card title="Buy Zone" value={buyZone.toString()} />
      <Card title="Overvalued" value={overvalued.toString()} />
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
