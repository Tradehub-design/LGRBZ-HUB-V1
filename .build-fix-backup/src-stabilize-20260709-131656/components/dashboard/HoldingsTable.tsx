"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { usePortfolio } from "@/hooks/usePortfolio";
import { useHoldingsStore } from "@/store/holdingsStore";

type SortKey =
  | "ticker"
  | "value"
  | "profit"
  | "quantity"
  | "allocation";

export default function HoldingsTable(){

const { portfolio } = usePortfolio();
const { selectedTicker, selectHolding } = useHoldingsStore();

const [sort,setSort]=useState<SortKey>("value");

const [descending,setDescending]=useState(true);

const holdings=useMemo(()=>{

if(!portfolio) return [];

const rows=[...portfolio.holdings];

rows.sort((a,b)=>{

switch(sort){

case "ticker":

return a.ticker.localeCompare(b.ticker);

case "quantity":

return a.quantity-b.quantity;

case "profit":

return a.metrics.totalProfit-b.metrics.totalProfit;

case "allocation":

return a.metrics.allocationPercent-

b.metrics.allocationPercent;

default:

return a.metrics.marketValue-

b.metrics.marketValue;

}

});

return descending

?rows.reverse()

:rows;

},[portfolio,sort,descending]);

if(!portfolio){

return null;

}

function changeSort(key:SortKey){

if(sort===key){

setDescending(!descending);

return;

}

setSort(key);

setDescending(true);

}


return(

<div className="h-full rounded-2xl border bg-card">

<div className="border-b p-4">

<h2 className="font-semibold">

Current Holdings

</h2>

</div>

<table className="w-full">

<thead>

<tr className="text-left text-sm">

<th>

<button onClick={()=>changeSort("ticker")}>

Ticker

</button>

</th>

<th>

<button onClick={()=>changeSort("quantity")}>

Qty

</button>

</th>

<th>

<button onClick={()=>changeSort("value")}>

Value

</button>

</th>

<th>

<button onClick={()=>changeSort("profit")}>

Profit

</button>

</th>

<th>

<button onClick={()=>changeSort("allocation")}>

Allocation

</button>

</th>

</tr>

</thead>

<tbody>


{holdings.map(h=>(

<tr
key={h.ticker}
className="border-t">

<td className="py-3">

<div className="font-medium">

{h.ticker}

</div>

<div className="text-xs text-muted-foreground">

{h.company}

</div>

</td>

<td>

{h.quantity.toFixed(4)}

</td>

<td>

${h.metrics.marketValue.toLocaleString()}

</td>

<td>

<div className={

h.metrics.totalProfit>=0

?"text-green-600"

:"text-red-600"

}>

${h.metrics.totalProfit.toLocaleString()}

</div>

</td>

<td>

{h.metrics.allocationPercent.toFixed(2)}%

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

