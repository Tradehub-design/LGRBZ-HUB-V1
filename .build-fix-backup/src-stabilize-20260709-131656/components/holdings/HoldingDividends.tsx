"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot()";
import { useHoldingsStore } from "@/store/holdingsStore";

export default function HoldingDividends(){

const { portfolio }=useBusinessSnapshot()();

const { selectedTicker }=useHoldingsStore();

if(!portfolio){

return null;

}

const dividends=

portfolio.dividends.records.filter(

d=>d.ticker===selectedTicker

);

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Dividend History

</h2>

<div className="space-y-2">

{dividends.map(d=>(

<div

key={d.id}

className="flex justify-between rounded border p-3"

>

<div>

{d.paymentDate}

</div>

<div>

${d.amount.toFixed(2)}

</div>

</div>

))}

</div>

</div>

);

}

