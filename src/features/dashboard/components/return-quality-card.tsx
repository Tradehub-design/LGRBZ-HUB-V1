import { formatPercent } from "../format";

const rows = [
  { label: "Win Months", value: "5 / 6" },
  { label: "Positive Month Rate", value: formatPercent(83.33) },
  { label: "Best Month", value: formatPercent(10.33) },
  { label: "Worst Month", value: formatPercent(-2.25) },
];

export function ReturnQualityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Return Quality
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {row.label}
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-950">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
