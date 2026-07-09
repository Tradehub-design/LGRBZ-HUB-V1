import { accounts } from "../mock-data";
import { formatAccountMoney } from "../format";

export function BrokerAnalysisCard() {
  const brokers = Object.values(
    accounts.reduce((acc, account) => {
      if (!acc[account.broker]) acc[account.broker] = { broker: account.broker, value: 0 };
      acc[account.broker].value += account.currentValue;
      return acc;
    }, {} as Record<string, { broker: string; value: number }>)
  );

  const total = brokers.reduce((sum, broker) => sum + broker.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Broker Analysis</h2>

      <div className="mt-5 space-y-4">
        {brokers.map((broker) => {
          const percent = total === 0 ? 0 : (broker.value / total) * 100;

          return (
            <div key={broker.broker}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{broker.broker}</span>
                <span className="text-slate-500">{percent.toFixed(2)}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-slate-950" style={{ width: `${percent}%` }} />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {formatAccountMoney(broker.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
