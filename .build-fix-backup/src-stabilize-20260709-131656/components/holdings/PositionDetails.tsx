"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot()";
import { useHoldingsStore } from "@/store/holdingsStore";

export default function PositionDetails(){

const { portfolio }=useBusinessSnapshot()();

const { selectedTicker } = useHoldingsStore();

const holding=portfolio?.holdings.find(h=>h.ticker===selectedTicker)??portfolio?.holdings[0];

if(!holding){

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

Select a holding

</div>

);

}

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5 space-y-4">

<div>

<h2 className="text-3xl font-bold">

{holding.ticker}

</h2>

<p className="text-muted-foreground">

{holding.company}

</p>

</div>

<div className="grid grid-cols-2 gap-4">

<div>

<div className="text-xs">

Quantity

</div>

<div className="font-semibold">

{holding.quantity}

</div>

</div>

<div>

<div className="text-xs">

Average Cost

</div>

<div className="font-semibold">

${holding.metrics.averageCost.toFixed(2)}

</div>

</div>

<div>

<div className="text-xs">

Market Value

</div>

<div className="font-semibold">

${holding.metrics.marketValue.toLocaleString()}

</div>

</div>

<div>

<div className="text-xs">

Profit

</div>

<div className="font-semibold">

${holding.metrics.totalProfit.toLocaleString()}

</div>

</div>

</div>

<div>

<h3 className="font-semibold mb-2">

Open FIFO Lots

</h3>

<div className="space-y-2">

{holding.openLots.map(lot=>(

<div

key={lot.id}

className="rounded border p-3"

>

<div className="flex justify-between">

<span>{lot.purchaseDate}</span>

<span>{lot.remaining}</span>

</div>

<div className="text-xs text-muted-foreground">

${lot.purchasePrice.toFixed(2)}

</div>

</div>

))}

</div>

</div>

</div>

);

}

