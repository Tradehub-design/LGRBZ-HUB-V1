import { analyticsCurve } from "../mock-data";
import {
  formatAnalyticsMoney,
  formatAnalyticsPercent,
} from "../format";

export function AnalyticsSummaryCards() {
  const first = analyticsCurve[0];
  const last = analyticsCurve[analyticsCurve.length - 1];

  const pnl = last.value - first.value;
  const returnPercent = (pnl / first.value) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Current Value" value={formatAnalyticsMoney(last.value)} />
      <Card title="Starting Value" value={formatAnalyticsMoney(first.value)} />
      <Card title="Total P/L" value={formatAnalyticsMoney(pnl)} positive />
      <Card title="Total Return" value={formatAnalyticsPercent(returnPercent)} positive />
    </div>
  );
}

function Card({
  title,
  value,
  positive,
}: {
  title: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div
        className={[
          "mt-3 text-2xl font-semibold",
          positive ? "text-emerald-700" : "text-slate-950",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
