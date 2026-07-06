import { transactions } from "../mock-data";

export function TransactionTypeCard() {
  const counts = transactions.reduce<Record<string, number>>(
    (acc, tx) => {
      acc[tx.type] = (acc[tx.type] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Transaction Types
      </h2>

      <div className="mt-5 space-y-3">
        {Object.entries(counts).map(([type, count]) => (
          <div
            key={type}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="font-medium">{type}</span>
            <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
