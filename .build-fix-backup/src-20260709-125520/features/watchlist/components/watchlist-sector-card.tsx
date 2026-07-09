import { watchlistItems } from "../mock-data";

export function WatchlistSectorCard() {
  const sectors = Object.values(
    watchlistItems.reduce((acc, item) => {
      acc[item.sector] = (acc[item.sector] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  const sectorRows = Object.entries(
    watchlistItems.reduce((acc, item) => {
      acc[item.sector] = (acc[item.sector] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  const total = sectors.reduce((sum, count) => sum + count, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Sector Breakdown
      </h2>

      <div className="mt-5 space-y-4">
        {sectorRows.map(([sector, count]) => {
          const percent = total === 0 ? 0 : (count / total) * 100;

          return (
            <div key={sector}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{sector}</span>
                <span className="text-slate-500">{percent.toFixed(2)}%</span>
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
