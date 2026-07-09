"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

generateInsights

} from "@/core/ai/insights";

export default function PortfolioInsights(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

const insights=

generateInsights(

portfolio

);

return(

<div className="rounded-xl border bg-card p-5">

<h2 className="mb-4 font-semibold">

AI Portfolio Insights

</h2>

<div className="space-y-3">

{insights.map((item,index)=>(

<div

key={index}

className="rounded-lg border p-3"

>

<div className="font-semibold">

{item.title}

</div>

<div className="text-sm text-muted-foreground">

{item.description}

</div>

</div>

))}

</div>

</div>

);

}

