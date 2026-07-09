import { notifications } from "../mock-data";

export function NotificationsSummaryCards() {
  const unread = notifications.filter((item) => !item.read).length;
  const priceAlerts = notifications.filter((item) => item.type === "Price Alert").length;
  const dividends = notifications.filter((item) => item.type === "Dividend").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Notifications" value={notifications.length.toString()} />
      <Card title="Unread" value={unread.toString()} />
      <Card title="Price Alerts" value={priceAlerts.toString()} />
      <Card title="Dividends" value={dividends.toString()} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}