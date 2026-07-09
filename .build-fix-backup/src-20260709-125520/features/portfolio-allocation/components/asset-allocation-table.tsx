const rows = [
  { asset: "Stocks", target: "60%", current: "0%", difference: "-60%" },
  { asset: "ETFs", target: "30%", current: "0%", difference: "-30%" },
  { asset: "Cash", target: "10%", current: "0%", difference: "-10%" },
];

export function AssetAllocationTable() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Asset Allocation</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2">Asset</th>
              <th className="py-2">Target</th>
              <th className="py-2">Current</th>
              <th className="py-2">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.asset} className="border-t">
                <td className="py-3 font-medium">{row.asset}</td>
                <td className="py-3">{row.target}</td>
                <td className="py-3">{row.current}</td>
                <td className="py-3">{row.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
