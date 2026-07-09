"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { chartColors } from "./chartColors";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export function PortfolioPieChart({
  data,
}: Props) {
  if (!data.length) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <PieChart>
        <Pie
          data={data}
          outerRadius={110}
          innerRadius={65}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={chartColors[index]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
