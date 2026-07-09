"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function BestWorstDays(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

const sorted=[

...portfolio.timeline

].sort(

(a,b)=>

b.profit-a.profit

);

const best=sorted[0];

const worst=

sorted[sorted.length-1];

return(

<div className="grid gap-4 md:grid-cols-2">

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="font-semibold">

Best Day

</h2>

<div className="mt-3">

{best?.date}

</div>

<div className="text-3xl font-bold">

${best?.profit.toFixed(2)}

</div>

</div>

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="font-semibold">

Worst Day

</h2>

<div className="mt-3">

{worst?.date}

</div>

<div className="text-3xl font-bold">

${worst?.profit.toFixed(2)}

</div>

</div>

</div>

);

}

