"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { usePortfolio } from "@/hooks/usePortfolio";
import { useReplayPlayerStore } from "@/store/replayPlayerStore";

export default function HistoricalEquityChart(){

const { portfolio } = usePortfolio();

const replay = useReplayPlayerStore();

if(!portfolio){

return null;

}

const data = portfolio.timeline.map((p,index)=>({

...p,

index

}));

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="mb-4">

<h2 className="font-semibold">

Portfolio Equity Curve

</h2>

</div>

<div className="h-[320px]">

<ResponsiveContainer>

<AreaChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

<Area

type="monotone"

dataKey="portfolioValue"

strokeWidth={2}

fillOpacity={0.2}

/>

<ReferenceLine

x={

data[

Math.min(

replay.currentIndex,

Math.max(

0,

data.length-1

)

)

]?.date

}

strokeWidth={2}

/>

</AreaChart>

</ResponsiveContainer>

</div>

</div>

);

}

