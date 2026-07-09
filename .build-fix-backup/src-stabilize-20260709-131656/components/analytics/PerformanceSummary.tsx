"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot()";

import {

calculatePerformanceMetrics

} from "@/core/analytics/performance";

export default function PerformanceSummary(){

const { portfolio }=useBusinessSnapshot()();

if(!portfolio){

return null;

}

const metrics=

calculatePerformanceMetrics(

portfolio

);

const cards=[

["Portfolio",

metrics.portfolioValue],

["Invested",

metrics.investedCapital],

["Profit",

metrics.totalReturn],

["Return %",

metrics.totalReturnPercent]

];

return(

<div className="grid gap-4 lg:grid-cols-4">

{cards.map(([title,value])=>(

<div

key={title}

className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5"

>

<div className="text-sm text-muted-foreground">

{title}

</div>

<div className="mt-2 text-3xl font-bold">

{typeof value==="number"

?value.toLocaleString(

undefined,

{

maximumFractionDigits:2

}

)

:value}

</div>

</div>

))}

</div>

);

}

