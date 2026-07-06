import { formatPercent } from "../format";

const benchmarks = [
  {
    name: "Portfolio",
    returnValue: 16.91,
  },
  {
    name: "ASX 200",
    returnValue: 8.42,
  },
  {
    name: "NASDAQ 100",
    returnValue: 14.76,
  },
  {
    name: "Cash Rate",
    returnValue: 4.35,
  },
];

export function BenchmarkCard() {
  const highest = Math.max(...benchmarks.map((item) => item.returnValue));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Benchmark Comparison
      </h2>

      <div className="mt-5 space-y-4">
        {benchmarks.map((item) => (
          <div key={item.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="font-semibold text-slate-950">
                {formatPercent(item.returnValue)}
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{
                  width: `${Math.max(4, (item.returnValue / highest) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
