import { securityEvents } from "../mock-data";

export function SecurityFooter() {
  const successful = securityEvents.filter(
    (event) => event.status === "Success"
  ).length;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric
          title="Audit Events"
          value={securityEvents.length.toString()}
        />

        <Metric
          title="Successful"
          value={successful.toString()}
        />

        <Metric
          title="Security Score"
          value="92/100"
        />

        <Metric
          title="Account Status"
          value="Protected"
        />
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