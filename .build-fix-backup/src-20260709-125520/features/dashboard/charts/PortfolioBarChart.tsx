"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

type Props = {
  data: {
    label: string;
    value: number;
  }[];
};

export function PortfolioBarChart({
  data,
}: Props) {
  return (
    <ResponsiveContainer
      width="100%"
      height={340}
    >
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="4 4"
        />

        <XAxis dataKey="label" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="value"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
