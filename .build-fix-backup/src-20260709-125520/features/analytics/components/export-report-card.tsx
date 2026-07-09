export function ExportReportCard() {
  const buttons = [
    "Export PDF",
    "Export Excel",
    "Export CSV",
    "Print Report",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Export Reports
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {buttons.map((button) => (
          <button
            key={button}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold hover:bg-slate-100"
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}
