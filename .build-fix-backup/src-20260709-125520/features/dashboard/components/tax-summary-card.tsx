import { formatMoney } from "../format";

const taxRows = [
  {
    label: "Realised Capital Gains",
    value: 2840.2,
  },
  {
    label: "Realised Capital Losses",
    value: -620.4,
  },
  {
    label: "Net Realised Gain",
    value: 2219.8,
  },
  {
    label: "Dividend Income",
    value: 1444.42,
  },
];

export function TaxSummaryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Tax Summary</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {taxRows.map((row) => {
          const negative = row.value < 0;

          return (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm font-medium text-slate-600">
                {row.label}
              </span>

              <span
                className={[
                  "text-sm font-semibold",
                  negative ? "text-rose-700" : "text-slate-950",
                ].join(" ")}
              >
                {formatMoney(row.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
