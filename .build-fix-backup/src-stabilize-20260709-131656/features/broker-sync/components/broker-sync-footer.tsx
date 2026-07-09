import { brokerConnections } from "../mock-data";

export function BrokerSyncFooter() {
  const trades = brokerConnections.reduce(
    (sum, broker) => sum + broker.trades,
    0
  );

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Brokers" value={brokerConnections.length.toString()} />
        <Metric title="Imported Trades" value={trades.toString()} />
        <Metric title="Sync Status" value="Healthy" />
        <Metric title="Review Items" value="2" />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
