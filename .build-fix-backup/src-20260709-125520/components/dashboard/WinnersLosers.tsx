"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function WinnersLosers(){

const { portfolio } = usePortfolio();

if(!portfolio){

return null;

}

const sorted=[

...portfolio.holdings

].sort(

(a,b)=>

b.metrics.totalProfit-

a.metrics.totalProfit

);

const winners=sorted.slice(0,5);

const losers=[...sorted]

.reverse()

.slice(0,5);

return(

<div className="grid gap-6 lg:grid-cols-2">

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Top Winners

</h2>

{winners.map(h=>(

<div
key={h.ticker}
className="flex justify-between py-2">

<span>{h.ticker}</span>

<span>

${h.metrics.totalProfit.toFixed(2)}

</span>

</div>

))}

</div>

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Top Losers

</h2>

{losers.map(h=>(

<div
key={h.ticker}
className="flex justify-between py-2">

<span>{h.ticker}</span>

<span>

${h.metrics.totalProfit.toFixed(2)}

</span>

</div>

))}

</div>

</div>

);

}

