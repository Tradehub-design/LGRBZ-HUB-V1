const reportTypes = [
  "Portfolio Summary",
  "Performance Report",
  "Dividend Report",
  "Tax Report",
  "Allocation Report",
  "Portfolio Health Report",
];

export function ReportGeneratorCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Generate Report
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reportTypes.map((report) => (
          <button
            key={report}
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            {report}
          </button>
        ))}
      </div>
    </div>
  );
}
