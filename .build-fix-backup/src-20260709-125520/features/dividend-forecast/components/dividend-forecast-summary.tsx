import { dividendForecastRows } from "../mock-data";
import { formatForecastMoney } from "../format";

export function DividendForecastSummary() {
  const annualIncome = dividendForecastRows.reduce(
    (sum, row) => sum + row.annualIncome,
    0
  );

  const monthlyAverage = annualIncome / 12;
  const holdings = dividendForecastRows.length;

  const highest = [...dividendForecastRows].sort(
    (a, b) => b.annualIncome - a.annualIncome
  )[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Forecast Annual Income" value={formatForecastMoney(annualIncome)} />
      <Card title="Monthly Average" value={formatForecastMoney(monthlyAverage)} />
      <Card title="Income Holdings" value={holdings.toString()} />
      <Card title="Top Income Source" value={highest.symbol} />
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
