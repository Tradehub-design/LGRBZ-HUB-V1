const accounts = [
  { name: "Google", status: "Connected" },
  { name: "Email Login", status: "Active" },
  { name: "Broker API", status: "Not Connected" },
];

export function ConnectedAccountsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Connected Accounts
      </h2>

      <div className="mt-5 space-y-3">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-semibold text-slate-950">
              {account.name}
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {account.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}