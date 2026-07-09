import { attributionRows } from "../mock-data";
import {
  formatAttributionMoney,
  formatAttributionPercent,
} from "../format";

export function TopContributorsCard() {
  const rows = [...attributionRows].sort(
    (a, b) => b.contribution - a.contribution
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Top Contributors
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.id} className="flex justify-between py-3">
            <div>
              <div className="font-semibold text-slate-950">{row.source}</div>
              <div className="text-xs text-slate-500">{row.category}</div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-emerald-700">
                {formatAttributionMoney(row.contribution)}
              </div>
              <div className="text-xs text-emerald-600">
                {formatAttributionPercent(row.contributionPercent)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
