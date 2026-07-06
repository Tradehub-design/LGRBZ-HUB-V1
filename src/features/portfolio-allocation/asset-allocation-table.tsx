import { assetAllocation } from "../mock-data";

export function AssetAllocationTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold">
          Asset Allocation
        </h2>
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left">Asset</th>
            <th className="px-5 py-3 text-right">Value</th>
            <th className="px-5 py-3 text-right">Current %</th>
            <th className="px-5 py-3 text-right">Target %</th>
          </tr>
        </thead>

        <tbody>
          {assetAllocation.map((asset) => (
            <tr key={asset.id} className="border-t">
              <td className="px-5 py-4 font-semibold">
                {asset.category}
              </td>

              <td className="px-5 py-4 text-right">
                ${asset.value.toLocaleString()}
              </td>

              <td className="px-5 py-4 text-right">
                {asset.percentage}%
              </td>

              <td className="px-5 py-4 text-right">
                {asset.targetPercentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
