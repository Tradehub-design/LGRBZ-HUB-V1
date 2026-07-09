"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function HistoricalHoldings(){

const {

portfolio,

snapshot,

replay

}=usePortfolio();

if(!portfolio){

return null;

}

const holdings=

replay

?snapshot?.holdings??[]

:portfolio.holdings;

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Historical Holdings

</h2>

<div className="space-y-2">

{holdings.map(h=>(

<div

key={h.ticker}

className="flex justify-between rounded border p-3"

>

<div>

<div className="font-medium">

{h.ticker}

</div>

<div className="text-xs text-muted-foreground">

{h.company}

</div>

</div>

<div className="text-right">

<div>

{h.quantity.toFixed(4)}

</div>

<div className="text-xs text-muted-foreground">

${h.metrics.marketValue.toLocaleString()}

</div>

</div>

</div>

))}

</div>

</div>

);

}

