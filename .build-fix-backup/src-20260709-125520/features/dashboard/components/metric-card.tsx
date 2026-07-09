type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
};

export function MetricCard({ title, value, change, positive }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-2xl font-semibold tracking-tight text-slate-950">
          {value}
        </p>

        {change ? (
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700",
            ].join(" ")}
          >
            {change}
          </span>
        ) : null}
      </div>
    </div>
  );
}
