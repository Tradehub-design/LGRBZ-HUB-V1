import { notifications } from "../mock-data";

export function NotificationsFooter() {
  const unread = notifications.filter(
    (item) => !item.read
  ).length;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric
          title="Notifications"
          value={notifications.length.toString()}
        />

        <Metric
          title="Unread"
          value={unread.toString()}
        />

        <Metric
          title="Price Alerts"
          value="3"
        />

        <Metric
          title="Status"
          value="Healthy"
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