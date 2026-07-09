export function BusinessModelFooter() {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Risk / Trade" value="0.50%" />
        <Metric title="Daily Limit" value="2%" />
        <Metric title="Weekly Limit" value="5%" />
        <Metric title="Monthly Limit" value="10%" />
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}
