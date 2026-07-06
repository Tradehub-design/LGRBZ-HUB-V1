import { assetAllocation } from "../mock-data";

export function AllocationSummaryCards() {
  const assets = assetAllocation.length;

  const portfolioValue = assetAllocation.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const largest = [...assetAllocation].sort(
    (a, b) => b.value - a.value
  )[0];

  const offTarget = assetAllocation.filter(
    (item) => Math.abs(item.percentage - item.targetPercentage) > 3
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Portfolio Value" value={`$${portfolioValue.toLocaleString()}`} />
      <Card title="Asset Classes" value={assets.toString()} />
      <Card title="Largest Allocation" value={largest.category} />
      <Card title="Needs Rebalancing" value={offTarget.toString()} />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">
        {value}
      </div>
    </div>
  );
}
