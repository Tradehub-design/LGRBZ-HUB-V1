import { formatForecastMoney } from "../format";

const projections = [
  { year: "2026", income: 1551.8 },
  { year: "2027", income: 1706.98 },
  { year: "2028", income: 1877.68 },
  { year: "2029", income: 2065.45 },
  { year: "2030", income: 2272 },
];

export function IncomeGrowthCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Income Growth Projection
      </h2>

      <div className="mt-5 space-y-4">
        {projections.map((item) => {
          const percent = (item.income / projections[projections.length - 1].income) * 100;

          return (
            <div key={item.year}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{item.year}</span>
                <span className="font-semibold text-slate-950">
                  {formatForecastMoney(item.income)}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
