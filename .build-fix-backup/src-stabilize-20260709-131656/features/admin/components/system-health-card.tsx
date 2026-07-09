const health = [
  { label: "Database", value: "Healthy" },
  { label: "Price cache", value: "Healthy" },
  { label: "Report engine", value: "Ready" },
  { label: "Backup system", value: "Healthy" },
];

export function SystemHealthCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        System Health
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {health.map((item) => (
          <div key={item.label} className="flex justify-between py-3">
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className="text-sm font-semibold text-slate-950">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
