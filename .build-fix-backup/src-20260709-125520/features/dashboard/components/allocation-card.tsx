import { allocations } from "../mock-data";
import { formatMoney } from "../format";

export function AllocationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Allocation</h2>

      <div className="mt-5 space-y-4">
        {allocations.map((slice) => (
          <div key={slice.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{slice.label}</span>
              <span className="text-slate-500">{slice.percentage.toFixed(2)}%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${slice.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatMoney(slice.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
