"use client";

import { useTransactionStore } from "../store";

const accounts = [
  "All Accounts",
  "Main Portfolio",
  "ETF Builder",
  "Baby Portfolio",
];

const transactionTypes = [
  "All",
  "Buy",
  "Sell",
  "Dividend",
  "Deposit",
  "Withdrawal",
  "Transfer",
  "Fee",
];

export function TransactionsFilterBar() {
  const {
    account,
    search,
    type,
    setAccount,
    setSearch,
    setType,
  } = useTransactionStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          {accounts.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          {transactionTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticker or company..."
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
