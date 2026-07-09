import { dividendRecords } from "../mock-data";
import { formatDividendMoney } from "../format";

export function DividendSummaryCards() {
  const gross = dividendRecords.reduce(
    (sum, row) => sum + row.grossAmount,
    0
  );

  const net = dividendRecords.reduce(
    (sum, row) => sum + row.netAmount,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Payments" value={dividendRecords.length.toString()} />
      <Card title="Gross Income" value={formatDividendMoney(gross)} />
      <Card title="Net Income" value={formatDividendMoney(net)} />
      <Card title="Tax Withheld" value={formatDividendMoney(gross - net)} />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>

      <div className="mt-3 text-2xl font-semibold text-slate-950">
        {value}
      </div>
    </div>
  );
}
