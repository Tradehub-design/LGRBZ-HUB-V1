import { formatMoney, formatPercent } from "../format";

const rows = [
  {
    label: "Monthly Investment",
    value: 625,
  },
  {
    label: "Annualised Investment",
    value: 7500,
  },
  {
    label: "Target Annual Investment",
    value: 12000,
  },
];

export function SavingsRateCard() {
  const annualised = 7500;
  const target = 12000;
  const progress = (annualised / target) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Savings Rate</h2>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold text-slate-950">
              {formatPercent(progress)}
            </div>
            <div className="text-sm text-slate-500">of annual target</div>
          </div>

          <div className="text-right text-sm font-semibold text-slate-950">
            {formatMoney(annualised)} / {formatMoney(target)}
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-slate-950"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span className="text-sm font-medium text-slate-600">
              {row.label}
            </span>
            <span className="text-sm font-semibold text-slate-950">
              {formatMoney(row.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
