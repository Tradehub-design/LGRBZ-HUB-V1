"use client";

const commands = [
  "Open Dashboard",
  "View Holdings",
  "Import Transactions",
  "Generate Report",
  "Open Dividend Forecast",
  "Portfolio Health",
  "Notifications",
];

export function GlobalCommandPalette() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Command Palette
      </h2>

      <div className="mt-5 space-y-2">
        {commands.map((command) => (
          <button
            key={command}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium hover:bg-slate-100"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
