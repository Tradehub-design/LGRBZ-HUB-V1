"use client";

import { transactions } from "../mock-data";
import { useTransactionStore } from "../store";
import {
  formatTransactionMoney,
  formatTransactionNumber,
} from "../format";

export function TransactionsTable() {
  const { account, type, search } = useTransactionStore();

  const rows = transactions.filter((tx) => {
    const accountMatch =
      account === "All Accounts" || tx.account === account;

    const typeMatch =
      type === "All" || tx.type === type;

    const searchMatch =
      tx.symbol.toLowerCase().includes(search.toLowerCase()) ||
      tx.company.toLowerCase().includes(search.toLowerCase());

    return accountMatch && typeMatch && searchMatch;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold">
          Transactions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Date",
                "Account",
                "Type",
                "Ticker",
                "Qty",
                "Price",
                "Fees",
                "Total",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 text-left font-semibold text-slate-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">{tx.date}</td>
                <td className="px-5 py-4">{tx.account}</td>
                <td className="px-5 py-4">{tx.type}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold">
                    {tx.symbol}
                  </div>
                  <div className="text-xs text-slate-500">
                    {tx.company}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {formatTransactionNumber(tx.quantity)}
                </td>
                <td className="px-5 py-4">
                  {formatTransactionMoney(tx.price)}
                </td>
                <td className="px-5 py-4">
                  {formatTransactionMoney(tx.fees)}
                </td>
                <td className="px-5 py-4 font-semibold">
                  {formatTransactionMoney(tx.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
