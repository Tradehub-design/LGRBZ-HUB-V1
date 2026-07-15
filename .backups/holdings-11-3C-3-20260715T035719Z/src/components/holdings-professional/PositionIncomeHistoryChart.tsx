"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
} from "lucide-react";
import type {
  PositionDividendYear,
} from "@/lib/holdings-professional/positionDividendModels";

type PositionIncomeHistoryChartProps = {
  history:
    PositionDividendYear[];

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

function compactMoney(
  value: number
): string {
  if (
    Math.abs(value) >=
    1_000
  ) {
    return `$${(
      value /
      1_000
    ).toFixed(
      1
    )}k`;
  }

  return `$${value.toFixed(
    0
  )}`;
}

function IncomeTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;

  payload?: Array<{
    payload:
      PositionDividendYear;
  }>;

  currency: string;
}) {
  const year =
    payload?.[0]?.payload;

  if (
    !active ||
    !year
  ) {
    return null;
  }

  return (
    <div className="min-w-[210px] rounded-xl border border-slate-700 bg-[#071522]/95 p-3 shadow-2xl backdrop-blur-xl">
      <p className="font-semibold text-white">
        {year.year}
      </p>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">
            Net income
          </span>

          <span className="font-semibold text-emerald-200">
            {money(
              year.netIncome,
              currency
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">
            Gross income
          </span>

          <span className="font-semibold text-white">
            {money(
              year.grossIncome,
              currency
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">
            Payments
          </span>

          <span className="font-semibold text-white">
            {year.paymentCount}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">
            Growth
          </span>

          <span
            className={
              (
                year.growthPercent ||
                0
              ) >= 0
                ? "font-semibold text-emerald-300"
                : "font-semibold text-rose-300"
            }
          >
            {year.growthPercent ===
            null
              ? "—"
              : `${year.growthPercent > 0 ? "+" : ""}${year.growthPercent.toFixed(
                  2
                )}%`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PositionIncomeHistoryChart({
  history,
  currency,
}: PositionIncomeHistoryChartProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/35 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <BarChart3 className="h-5 w-5" />
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
            Income History
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Annual dividend income
          </h2>
        </div>
      </div>

      <div className="mt-5 h-[280px]">
        {history.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={history}
              margin={{
                top: 8,
                right: 8,
                bottom: 0,
                left: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(51,65,85,0.4)"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill:
                    "#64748b",
                  fontSize: 10,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={54}
                tickFormatter={
                  compactMoney
                }
                tick={{
                  fill:
                    "#64748b",
                  fontSize: 10,
                }}
              />

              <Tooltip
                content={
                  <IncomeTooltip
                    currency={
                      currency
                    }
                  />
                }
                cursor={{
                  fill:
                    "rgba(148,163,184,0.06)",
                }}
              />

              <Bar
                dataKey="netIncome"
                fill="#34d399"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                animationDuration={650}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700">
            <div className="text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm font-medium text-slate-400">
                Annual income history unavailable
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Historical paid dividends will populate this chart.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
