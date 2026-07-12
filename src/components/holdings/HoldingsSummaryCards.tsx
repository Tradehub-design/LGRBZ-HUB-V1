"use client";

import { buildHoldingSummary } from "@/lib/holdings/holdingsSummary";

export default function HoldingsSummaryCards({
rows
}:{rows:any[]}){

const s=buildHoldingSummary(rows);

const card=(title:string,value:string)=>(
<div className="rounded-xl border bg-white p-5 shadow-sm">
<div className="text-xs text-slate-500">{title}</div>
<div className="mt-2 text-2xl font-bold">{value}</div>
</div>
);

return(
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
{card("Portfolio Value",
"$"+s.totalValue.toLocaleString())}

{card("Cost Base",
"$"+s.totalCost.toLocaleString())}

{card("Unrealised Gain",
"$"+s.totalGain.toLocaleString())}

{card("Holdings",
String(s.holdings))}
</div>
);
}
