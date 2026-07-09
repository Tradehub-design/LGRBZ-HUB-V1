import { livePrices } from "../mock-data";

export function LivePricesFooterSummary() {
  const live = livePrices.filter(
    (item) => item.status === "Live"
  ).length;

  const delayed = livePrices.filter(
    (item) => item.status === "Delayed"
  ).length;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric
          title="Tracked"
          value={livePrices.length.toString()}
        />

        <Metric
          title="Live"
          value={live.toString()}
        />

        <Metric
          title="Delayed"
          value={delayed.toString()}
        />

        <Metric
          title="Alerts"
          value="3"
        />
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}
