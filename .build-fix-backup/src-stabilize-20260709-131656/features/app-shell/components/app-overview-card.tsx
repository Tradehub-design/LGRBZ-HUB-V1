const modules = [
  "Dashboard",
  "Holdings",
  "Transactions",
  "Accounts",
  "Analytics",
  "Watchlist",
  "Dividends",
  "Goals",
  "Tax Centre",
  "Reports",
  "Settings",
  "Admin",
];

export function AppOverviewCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Application Overview
      </h2>

      <div className="mt-5 grid gap-2 md:grid-cols-3">
        {modules.map((module) => (
          <div
            key={module}
            className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            {module}
          </div>
        ))}
      </div>
    </div>
  );
}
