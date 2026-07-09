const imports = [
  { file: "commsec-july.csv", date: "2026-07-06", rows: 42, status: "Imported" },
  { file: "pocket-june.csv", date: "2026-07-01", rows: 18, status: "Imported" },
];

export function ImportHistoryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Import History</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {imports.map((item) => (
          <div key={item.file} className="flex justify-between py-3">
            <div>
              <div className="font-semibold text-slate-950">{item.file}</div>
              <div className="text-xs text-slate-500">{item.date}</div>
            </div>
            <div className="text-right text-sm">
              <div className="font-semibold">{item.rows} rows</div>
              <div className="text-xs text-emerald-600">{item.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
