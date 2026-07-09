import { formatPercent } from "@/lib/portfolio-engine/format";

type RiskRadarProps = {
  largestHoldingPercent: number;
  largestSectorPercent: number;
  largestCountryPercent: number;
  highRiskPercent: number;
  cashPercent: number;
};

export function RiskRadar({
  largestHoldingPercent,
  largestSectorPercent,
  largestCountryPercent,
  highRiskPercent,
  cashPercent,
}: RiskRadarProps) {
  const rows = [
    ["Largest Holding", largestHoldingPercent],
    ["Largest Sector", largestSectorPercent],
    ["Largest Country", largestCountryPercent],
    ["High Risk", highRiskPercent],
    ["Cash", cashPercent],
  ] as const;

  return (
    <div className="grid gap-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-300">{label}</span>
            <span className="font-semibold text-white">{formatPercent(value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={value > 40 ? "h-full rounded-full bg-rose-500" : value > 25 ? "h-full rounded-full bg-amber-500" : "h-full rounded-full bg-sky-500"}
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
