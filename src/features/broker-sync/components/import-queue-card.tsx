const queue = [
  {
    id: "1",
    file: "commsec_transactions_july.csv",
    status: "Ready",
    rows: 42,
  },
  {
    id: "2",
    file: "dividend_statement_q2.csv",
    status: "Waiting",
    rows: 8,
  },
];

export function ImportQueueCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Import Queue</h2>

      <div className="mt-5 space-y-3">
        {queue.map((item) => (
          <div key={item.id} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {item.file}
                </div>
                <div className="text-xs text-slate-500">{item.rows} rows</div>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
