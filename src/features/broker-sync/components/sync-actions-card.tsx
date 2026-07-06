const actions = [
  "Connect Broker",
  "Manual Sync",
  "Import CSV",
  "Disconnect Account",
];

export function SyncActionsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Sync Actions
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold hover:bg-slate-100"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
