import { accounts } from "../mock-data";
import { formatAccountMoney } from "../format";

export function AccountAllocationCard() {
  const total = accounts.reduce(
    (sum, account) => sum + account.currentValue,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Capital Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {accounts.map((account) => {
          const percent =
            (account.currentValue / total) * 100;

          return (
            <div key={account.id}>
              <div className="mb-2 flex justify-between">
                <span className="font-medium">
                  {account.name}
                </span>

                <span className="text-sm">
                  {percent.toFixed(2)}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {formatAccountMoney(account.currentValue)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
