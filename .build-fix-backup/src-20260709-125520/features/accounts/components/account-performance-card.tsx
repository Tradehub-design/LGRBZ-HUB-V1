import { accounts } from "../mock-data";
import {
  formatAccountMoney,
  formatAccountPercent,
} from "../format";

export function AccountPerformanceCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Account Performance
      </h2>

      <div className="mt-5 space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{account.name}</div>
                <div className="text-xs text-slate-500">
                  {account.broker}
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-emerald-700">
                  {formatAccountMoney(account.unrealisedPnl)}
                </div>

                <div className="text-xs text-slate-500">
                  {formatAccountPercent(account.totalReturnPercent)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
