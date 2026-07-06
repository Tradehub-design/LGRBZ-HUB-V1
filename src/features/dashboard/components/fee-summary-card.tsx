import { formatMoney } from "../format";

const fees = [
  {
    label: "Brokerage",
    value: 128.4,
  },
  {
    label: "ETF Management Fees",
    value: 186.72,
  },
  {
    label: "FX Conversion Fees",
    value: 42.18,
  },
  {
    label: "Platform Fees",
    value: 0,
  },
];

export function FeeSummaryCard() {
  const total = fees.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Fee Summary
          </h2>
          <p className="mt-1 text-sm text-slate-500">Estimated annual costs</p>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold text-slate-950">
            {formatMoney(total)}
          </div>
          <div className="text-xs text-slate-500">total</div>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {fees.map((fee) => (
          <div
            key={fee.label}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <span className="text-sm font-medium text-slate-600">
              {fee.label}
            </span>
            <span className="text-sm font-semibold text-slate-950">
              {formatMoney(fee.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
