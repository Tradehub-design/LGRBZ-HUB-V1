"use client";

import { formatMoney, getTransactionSummary, NormalisedTransaction } from "@/lib/transactions/professionalTransactions";

type Props = {
  transactions: NormalisedTransaction[];
};

export function TransactionSummaryCards({ transactions }: Props) {
  const summary = getTransactionSummary(transactions);

  const cards = [
    { label: "Transactions", value: summary.count.toLocaleString("en-AU") },
    { label: "Buy Value", value: formatMoney(summary.buyValue) },
    { label: "Sell Value", value: formatMoney(summary.sellValue) },
    { label: "Dividends", value: formatMoney(summary.dividendValue) },
    { label: "Fees", value: formatMoney(summary.fees) },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {card.label}
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-50">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}
