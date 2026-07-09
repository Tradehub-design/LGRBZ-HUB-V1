import { formatMoney, formatPercent } from "../format";

const accounts = [
  {
    name: "Main Portfolio",
    broker: "CommSec",
    value: 68420.12,
    change: 12.84,
  },
  {
    name: "ETF Builder",
    broker: "CommSec Pocket",
    value: 31860.2,
    change: 18.22,
  },
  {
    name: "Baby Portfolio",
    broker: "Long Term",
    value: 7820.4,
    change: 9.42,
  },
  {
    name: "Cash Reserve",
    broker: "Bank Account",
    value: 20320,
    change: 0,
  },
];

export function AccountOverviewCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Account Overview
      </h2>

      <div className="mt-5 space-y-3">
        {accounts.map((account) => {
          const positive = account.change >= 0;

          return (
            <div
              key={account.name}
              className="rounded-xl border border-slate-100 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {account.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {account.broker}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-950">
                    {formatMoney(account.value)}
                  </div>
                  <div
                    className={[
                      "text-xs font-medium",
                      positive ? "text-emerald-600" : "text-rose-600",
                    ].join(" ")}
                  >
                    {formatPercent(account.change)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
