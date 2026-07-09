const templates = [
  "Portfolio Summary",
  "Tax Summary",
  "Dividend Income",
  "Performance Review",
  "Allocation Review",
];

export function ReportTemplatesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Report Templates
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {templates.map((template) => (
          <span
            key={template}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            {template}
          </span>
        ))}
      </div>
    </div>
  );
}
