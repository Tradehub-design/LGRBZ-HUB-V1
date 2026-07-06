const rows = [
  { symbol: "NDQ", return: "+22.14%" },
  { symbol: "NAB", return: "+17.17%" },
  { symbol: "VAS", return: "+9.34%" },
  { symbol: "COH", return: "+9.68%" },
];

export function TopPerformersCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Top Performers
      </h2>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div
            key={row.symbol}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="font-semibold">
              {row.symbol}
            </span>

            <span className="font-semibold text-emerald-700">
              {row.return}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
