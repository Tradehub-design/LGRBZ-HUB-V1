import { formatAnalyticsMoney } from "../format";

export function AnalyticsFooterSummary() {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric
          title="Portfolio Value"
          value={formatAnalyticsMoney(128420.72)}
        />

        <Metric
          title="Total Return"
          value="+28.42%"
        />

        <Metric
          title="Dividend Income"
          value={formatAnalyticsMoney(1855)}
        />

        <Metric
          title="Max Drawdown"
          value="-5.82%"
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
