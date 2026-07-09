"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";
import { useHoldingsStore } from "@/store/holdingsStore";

export default function AllocationGauge(){

const { portfolio }=useBusinessSnapshot();

const { selectedTicker }=

useHoldingsStore();

const holding=

portfolio?.holdings.find(

h=>h.ticker===selectedTicker

);

if(!holding){

return null;

}

const allocation=

holding.metrics.allocationPercent;

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm">

Portfolio Allocation

</div>

<div className="mt-5 h-4 rounded bg-muted">

<div

className="h-full rounded bg-primary"

style={{

width:`${allocation}%`

}}

 />

</div>

<div className="mt-3 text-3xl font-bold">

{allocation.toFixed(2)}%

</div>

</div>

);

}

