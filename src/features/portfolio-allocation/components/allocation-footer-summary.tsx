import { assetAllocation } from "../mock-data";

export function AllocationFooterSummary() {
  const value = assetAllocation.reduce((sum, item) => sum + item.value, 0);
  const offTarget = assetAllocation.filter(
    (item) => Math.abs(item.percentage - item.targetPercentage) > 3
  ).length;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Portfolio Value" value={`$${value.toLocaleString()}`} />
        <Metric title="Asset Classes" value={assetAllocation.length.toString()} />
        <Metric title="Off Target" value={offTarget.toString()} />
        <Metric title="Status" value={offTarget > 0 ? "Review" : "Balanced"} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
