"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buildDemoCandles } from "@/lib/market/charts/candles";

export function PriceChart() {
  const candles = buildDemoCandles();

  return (
    <ResponsiveContainer width="100%" height={420}>
      <AreaChart data={candles}>
        <CartesianGrid stroke="#1f3448" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="close"
          stroke="#38bdf8"
          fill="#0ea5e933"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
