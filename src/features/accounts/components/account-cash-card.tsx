import { accounts } from "../mock-data";
import { formatAccountMoney } from "../format";

export function AccountCashCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Cash Balances
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between py-3"
          >
            <div>
              <div className="font-semibold">
                {account.name}
              </div>

              <div className="text-xs text-slate-500">
                {account.broker}
              </div>
            </div>

            <div className="font-semibold">
              {formatAccountMoney(account.cashBalance)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
