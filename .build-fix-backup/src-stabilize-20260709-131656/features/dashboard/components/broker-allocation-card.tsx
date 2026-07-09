import { formatMoney } from "../format";

const brokers = [
  {
    name: "CommSec",
    value: 68420.12,
    percentage: 53.28,
  },
  {
    name: "CommSec Pocket",
    value: 31860.2,
    percentage: 24.81,
  },
  {
    name: "Long Term",
    value: 7820.4,
    percentage: 6.09,
  },
  {
    name: "Bank Account",
    value: 20320,
    percentage: 15.82,
  },
];

export function BrokerAllocationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Broker Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {brokers.map((broker) => (
          <div key={broker.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{broker.name}</span>
              <span className="text-slate-500">
                {broker.percentage.toFixed(2)}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${broker.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatMoney(broker.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
