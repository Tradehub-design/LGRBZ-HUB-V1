const targets = [
  {
    label: "VAS / Australian Market",
    current: 35.21,
    target: 40,
  },
  {
    label: "NDQ / US Growth",
    current: 26.61,
    target: 25,
  },
  {
    label: "Individual Shares",
    current: 31.51,
    target: 25,
  },
  {
    label: "Cash",
    current: 6.67,
    target: 10,
  },
];

export function TargetAllocationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Target Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {targets.map((item) => {
          const difference = item.current - item.target;

          return (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-slate-700">
                  {item.label}
                </span>
                <span
                  className={[
                    "font-semibold",
                    Math.abs(difference) <= 2
                      ? "text-emerald-700"
                      : "text-amber-700",
                  ].join(" ")}
                >
                  {difference >= 0 ? "+" : ""}
                  {difference.toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  Current {item.current.toFixed(2)}%
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  Target {item.target.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
