"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { buildDailySummary } from "@/core/ai/dailySummary";

export default function DailySummaryCard(){

const { portfolio }=usePortfolio();

if(!portfolio as any){

return null;

}

const lines=buildDailySummary(portfolio as any);

return(

<div className="rounded-xl border bg-card p-5">

<h2 className="mb-4 font-semibold">

Today's AI Summary

</h2>

<div className="space-y-2">

{lines.map((line,index)=>(

<div key={index}>

• {line}

</div>

))}

</div>

</div>

);

}

