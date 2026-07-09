import { transactions } from "../mock-data";
import { formatTransactionMoney } from "../format";

export function RecentDividendsCard() {
  const dividends = transactions.filter(
    (t) => t.type === "Dividend"
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Recent Dividends
      </h2>

      <div className="mt-5 space-y-3">
        {dividends.map((tx) => (
          <div
            key={tx.id}
            className="rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                {tx.symbol}
              </span>

              <span className="font-semibold">
                {formatTransactionMoney(tx.total)}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {tx.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
