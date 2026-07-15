"use client";

import {
  CalendarRange,
} from "lucide-react";
import type {
  PositionDividendMonth,
} from "@/lib/holdings-professional/positionDividendModels";

type PositionMonthlyIncomeProfileProps = {
  months:
    PositionDividendMonth[];

  currency: string;
};

function money(
  value: number,
  currency: string
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export function PositionMonthlyIncomeProfile({
  months,
  currency,
}: PositionMonthlyIncomeProfileProps) {
  const maximum =
    Math.max(
      1,
      ...months.map(
        month =>
          month.netIncome
      )
    );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/35 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
          <CalendarRange className="h-5 w-5" />
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Payment Seasonality
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Monthly income profile
          </h2>
        </div>
      </div>

      <div className="mt-6 flex h-[240px] items-end gap-2">
        {months.map(
          month => (
            <div
              key={month.month}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              <div className="flex min-h-0 flex-1 items-end">
                <div
                  className={[
                    "w-full",
                    "rounded-t-md",
                    "bg-gradient-to-t",
                    month.netIncome >
                    0
                      ? "from-sky-500/55 to-cyan-300"
                      : "from-slate-800 to-slate-700",
                  ].join(" ")}
                  title={`${month.monthLabel}: ${money(
                    month.netIncome,
                    currency
                  )}`}
                  style={{
                    height: `${Math.max(
                      month.netIncome > 0
                        ? 5
                        : 1,
                      (
                        month.netIncome /
                        maximum
                      ) *
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 truncate text-center text-[9px] text-slate-600">
                {month.monthLabel}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
