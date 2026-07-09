"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function HoldingsTable(){

const { portfolio }=usePortfolio();

if(!portfolio)return null;

return(

<div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

<div className="overflow-x-auto">

<table className="w-full">

<thead className="sticky top-0 bg-muted">

<tr>

<th className="px-6 py-4 text-left">Ticker</th>

<th className="px-6 py-4 text-right">Qty</th>

<th className="px-6 py-4 text-right">Avg Cost</th>

<th className="px-6 py-4 text-right">Price</th>

<th className="px-6 py-4 text-right">Value</th>

<th className="px-6 py-4 text-right">P/L</th>

<th className="px-6 py-4 text-right">Allocation</th>

</tr>

</thead>

<tbody>

{portfolio.holdings.map(h=>(

<tr

key={h.ticker}

className="border-t hover:bg-muted/40 transition-colors"

>

<td className="px-6 py-5 font-semibold">

{h.ticker}

</td>

<td className="px-6 py-5 text-right">

{h.quantity}

</td>

<td className="px-6 py-5 text-right">

${h.metrics.averageCost.toFixed(2)}

</td>

<td className="px-6 py-5 text-right">

${h.metrics.marketPrice.toFixed(2)}

</td>

<td className="px-6 py-5 text-right">

${h.metrics.marketValue.toLocaleString()}

</td>

<td className="px-6 py-5 text-right">

{h.metrics.unrealisedPercent.toFixed(2)}%

</td>

<td className="px-6 py-5 text-right">

{h.metrics.allocationPercent.toFixed(2)}%

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}
