import { transactions } from "../mock-data";
import { formatTransactionMoney } from "../format";

export function TransactionsFooterSummary() {
  const total = transactions.reduce(
    (sum, tx) => sum + tx.total,
    0
  );

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <div className="text-xs uppercase text-slate-400">
            Total Transactions
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {transactions.length}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-slate-400">
            Total Value
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {formatTransactionMoney(total)}
          </div>
        </div>
      </div>
    </div>
  );
}
