"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#1f8cff", "#7c3aed", "#10b981", "#f97316", "#ef4444", "#64748b"];

export function EquityAreaChart({
  data,
}: {
  data: { date: string; investedAud: number; cumulativeCashFlowAud: number }[];
}) {
  return (
    <div className="h-72 rounded-xl border border-[#173047] bg-[#081a2b] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f8cff" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#1f8cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#173047" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#071827", border: "1px solid #173047", borderRadius: 12, color: "#fff" }} />
          <Area type="monotone" dataKey="investedAud" stroke="#1f8cff" strokeWidth={3} fill="url(#equityGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AllocationDonutChart({
  data,
}: {
  data: { label: string; value: number; percent: number }[];
}) {
  return (
    <div className="h-64 rounded-xl border border-[#173047] bg-[#081a2b] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={62} outerRadius={92} paddingAngle={3}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#071827", border: "1px solid #173047", borderRadius: 12, color: "#fff" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeBarChart({
  data,
}: {
  data: { month: string; amount: number }[];
}) {
  return (
    <div className="h-64 rounded-xl border border-[#173047] bg-[#081a2b] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#173047" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#071827", border: "1px solid #173047", borderRadius: 12, color: "#fff" }} />
          <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
