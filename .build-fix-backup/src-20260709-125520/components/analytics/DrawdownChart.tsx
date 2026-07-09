"use client";

import {

Area,

AreaChart,

CartesianGrid,

ResponsiveContainer,

Tooltip,

XAxis,

YAxis

} from "recharts";

import { useBusinessSnapshot() } from "@/hooks/useBusinessSnapshot()";

export default function DrawdownChart(){

const { portfolio }=useBusinessSnapshot()();

if(!portfolio){

return null;

}

let peak=0;

const data=

portfolio.timeline.map(point=>{

peak=Math.max(

peak,

point.portfolioValue

);

return{

date:point.date,

drawdown:

peak===0

?0

:((

point.portfolioValue-

peak

)/peak)*100

};

});

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Drawdown

</h2>

<div className="h-[320px]">

<ResponsiveContainer>

<AreaChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

<Area

dataKey="drawdown"

type="monotone"

fillOpacity={0.25}

/>

</AreaChart>

</ResponsiveContainer>

</div>

</div>

);

}

