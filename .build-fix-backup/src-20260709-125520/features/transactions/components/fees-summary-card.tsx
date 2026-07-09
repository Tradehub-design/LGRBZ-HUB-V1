import { transactions } from "../mock-data";
import { formatTransactionMoney } from "../format";

export function FeesSummaryCard() {
  const totalFees = transactions.reduce(
    (sum, tx) => sum + tx.fees,
    0
  );

  const average =
    transactions.length === 0
      ? 0
      : totalFees / transactions.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Brokerage Fees
      </h2>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs uppercase text-slate-500">
            Total Fees
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {formatTransactionMoney(totalFees)}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs uppercase text-slate-500">
            Average Fee
          </div>

          <div className="mt-2 text-xl font-semibold">
            {formatTransactionMoney(average)}
          </div>
        </div>
      </div>
    </div>
  );
}
