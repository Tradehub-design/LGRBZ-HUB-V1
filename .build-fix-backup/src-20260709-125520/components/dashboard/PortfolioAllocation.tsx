"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function PortfolioAllocation(){

const { portfolio } = usePortfolio();

if(!portfolio){

return null;

}

const data=portfolio.holdings.map(h=>({

name:h.ticker,

value:h.metrics.marketValue

}));

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Portfolio Allocation

</h2>

<div className="h-80">

<ResponsiveContainer>

<PieChart>

<Pie

data={data}

dataKey="value"

nameKey="name"

outerRadius={120}

/>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

);

}

