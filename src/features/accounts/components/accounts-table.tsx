import { accounts } from "../mock-data";
import {
  formatAccountMoney,
  formatAccountPercent,
} from "../format";

export function AccountsTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Investment Accounts
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Account",
              "Broker",
              "Value",
              "Cash",
              "Unrealised",
              "Return",
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
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-5 py-4">
                <div className="font-semibold">{account.name}</div>
                <div className="text-xs text-slate-500">
                  {account.type}
                </div>
              </td>

              <td className="px-5 py-4">{account.broker}</td>

              <td className="px-5 py-4 font-semibold">
                {formatAccountMoney(account.currentValue)}
              </td>

              <td className="px-5 py-4">
                {formatAccountMoney(account.cashBalance)}
              </td>

              <td className="px-5 py-4 text-emerald-700 font-semibold">
                {formatAccountMoney(account.unrealisedPnl)}
              </td>

              <td className="px-5 py-4 font-semibold">
                {formatAccountPercent(account.totalReturnPercent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
