"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function LargestPositionCard(){

const { portfolio }=usePortfolio();

if(!portfolio) return null;

const holding=[

...portfolio.holdings

].sort(

(a,b)=>

b.metrics.marketValue-

a.metrics.marketValue

)[0];

if(!holding) return null;

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm text-muted-foreground">

Largest Position

</div>

<div className="mt-3 text-3xl font-bold">

{holding.ticker}

</div>

<div className="mt-2 text-xl">

${holding.metrics.marketValue.toLocaleString()}

</div>

<div className="mt-1 text-sm text-muted-foreground">

{holding.metrics.allocationPercent.toFixed(2)}%

of portfolio

</div>

</div>

);

}

