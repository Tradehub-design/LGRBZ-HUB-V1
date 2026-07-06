import { brokerConnections } from "../mock-data";

export function BrokerSyncSummary() {
  const connected = brokerConnections.filter(
    (b) => b.status === "Connected"
  ).length;

  const totalTrades = brokerConnections.reduce(
    (sum, b) => sum + b.trades,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card
        title="Connected Brokers"
        value={connected.toString()}
      />

      <Card
        title="Accounts"
        value={brokerConnections.length.toString()}
      />

      <Card
        title="Imported Trades"
        value={totalTrades.toString()}
      />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-3 text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}
