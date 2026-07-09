import { sectorAllocation } from "../mock-data";

export function SectorAllocationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Sector Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {sectorAllocation.map((sector) => (
          <div key={sector.id}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-700">
                {sector.sector}
              </span>
              <span className="text-slate-500">{sector.percentage}%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${sector.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              ${sector.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
