import { brokerConnections } from "../mock-data";

export function BrokerSyncTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold">
          Connected Brokers
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Broker",
              "Account",
              "Number",
              "Trades",
              "Status",
              "Last Sync",
            ].map((item) => (
              <th
                key={item}
                className="px-5 py-3 text-left font-semibold text-slate-600"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {brokerConnections.map((broker) => (
            <tr key={broker.id}>
              <td className="px-5 py-4 font-semibold">
                {broker.broker}
              </td>

              <td className="px-5 py-4">
                {broker.accountName}
              </td>

              <td className="px-5 py-4">
                {broker.accountNumber}
              </td>

              <td className="px-5 py-4">
                {broker.trades}
              </td>

              <td className="px-5 py-4">
                {broker.status}
              </td>

              <td className="px-5 py-4">
                {broker.lastSync}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
