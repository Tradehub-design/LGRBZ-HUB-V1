const health = [
  {
    metric: "Database",
    value: "Healthy",
  },
  {
    metric: "API",
    value: "Operational",
  },
  {
    metric: "Market Data",
    value: "Live",
  },
  {
    metric: "Storage",
    value: "Healthy",
  },
];

export function ApplicationHealthCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Application Health
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {health.map((item) => (
          <div
            key={item.metric}
            className="flex justify-between py-3"
          >
            <span>{item.metric}</span>

            <span className="font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
