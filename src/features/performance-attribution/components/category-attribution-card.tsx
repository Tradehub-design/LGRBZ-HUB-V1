import { attributionRows } from "../mock-data";
import { formatAttributionMoney } from "../format";

export function CategoryAttributionCard() {
  const rows = Object.values(
    attributionRows.reduce((acc, row) => {
      if (!acc[row.category]) {
        acc[row.category] = { category: row.category, contribution: 0 };
      }

      acc[row.category].contribution += row.contribution;
      return acc;
    }, {} as Record<string, { category: string; contribution: number }>)
  );

  const total = rows.reduce((sum, row) => sum + row.contribution, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Category Attribution
      </h2>

      <div className="mt-5 space-y-4">
        {rows.map((row) => {
          const percent = total === 0 ? 0 : (row.contribution / total) * 100;

          return (
            <div key={row.category}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{row.category}</span>
                <span className="text-slate-500">{percent.toFixed(2)}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {formatAttributionMoney(row.contribution)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
