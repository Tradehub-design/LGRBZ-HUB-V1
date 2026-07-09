const yields = [
  ["VAS", "3.18%"],
  ["NAB", "4.11%"],
];

export function DividendYieldCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Dividend Yield
      </h2>

      <div className="mt-5 space-y-3">
        {yields.map(([symbol, yieldValue]) => (
          <div
            key={symbol}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="font-semibold">{symbol}</span>
            <span className="font-semibold text-emerald-700">
              {yieldValue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
