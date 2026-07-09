import { formatMoney } from "../format";

const sectors = [
  { name: "Technology", value: 34180, percentage: 26.61 },
  { name: "Financials", value: 27840, percentage: 21.68 },
  { name: "Broad Market", value: 45220, percentage: 35.21 },
  { name: "Healthcare", value: 12630, percentage: 9.83 },
  { name: "Cash", value: 8550.72, percentage: 6.67 },
];

export function SectorExposureCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Sector Exposure
      </h2>

      <div className="mt-5 space-y-4">
        {sectors.map((sector) => (
          <div key={sector.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{sector.name}</span>
              <span className="text-slate-500">
                {sector.percentage.toFixed(2)}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${sector.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatMoney(sector.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
