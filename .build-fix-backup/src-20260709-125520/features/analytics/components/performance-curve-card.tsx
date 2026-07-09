"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { analyticsCurve } from "../mock-data";
import {
  formatAnalyticsCompactMoney,
  formatAnalyticsMoney,
} from "../format";

export function PerformanceCurveCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Performance Curve
      </h2>

      <div className="mt-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analyticsCurve}>
            <defs>
              <linearGradient id="analyticsCurve" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.2} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-AU", { month: "short" })
              }
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatAnalyticsCompactMoney(Number(value))}
            />

            <Tooltip
              formatter={(value) => formatAnalyticsMoney(Number(value))}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              }
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2}
              fill="url(#analyticsCurve)"
              className="text-slate-950"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
