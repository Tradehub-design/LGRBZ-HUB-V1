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

import { equityCurve } from "../mock-data";
import { formatCompactMoney, formatMoney } from "../format";

export function EquityCurveCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-950">
          Equity Curve
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={equityCurve}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.2} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-AU", {
                  month: "short",
                })
              }
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => formatCompactMoney(Number(value))}
            />

            <Tooltip
              formatter={(value) => formatMoney(Number(value))}
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
              fill="url(#equityGradient)"
              className="text-slate-950"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
