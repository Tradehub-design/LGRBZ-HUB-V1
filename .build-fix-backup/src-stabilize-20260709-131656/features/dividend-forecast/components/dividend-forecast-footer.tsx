import { dividendForecastRows } from "../mock-data";
import { formatForecastMoney } from "../format";

export function DividendForecastFooter() {
  const annual = dividendForecastRows.reduce(
    (sum, row) => sum + row.annualIncome,
    0
  );

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Annual Income" value={formatForecastMoney(annual)} />
        <Metric title="Monthly Average" value={formatForecastMoney(annual / 12)} />
        <Metric title="Income Holdings" value={dividendForecastRows.length.toString()} />
        <Metric title="Next Payment" value="18 Sep" />
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
