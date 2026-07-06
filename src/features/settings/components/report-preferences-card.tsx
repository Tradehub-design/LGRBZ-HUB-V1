"use client";

import { useSettingsStore } from "../store";

export function ReportPreferencesCard() {
  const { enableEmailReports, toggleEmailReports } = useSettingsStore();

  const reports = [
    "Weekly performance summary",
    "Monthly portfolio review",
    "Dividend income report",
    "Tax year summary",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Report Preferences
      </h2>

      <div className="mt-5 space-y-3">
        {reports.map((report) => (
          <div
            key={report}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">
              {report}
            </span>

            <button
              type="button"
              onClick={toggleEmailReports}
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                enableEmailReports
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}
            >
              {enableEmailReports ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
