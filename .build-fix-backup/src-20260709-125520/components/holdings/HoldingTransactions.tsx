"use client";

import { useBusinessSnapshot() } from "@/hooks/useBusinessSnapshot()";
import { useHoldingsStore } from "@/store/holdingsStore";

export default function HoldingTransactions(){

const { portfolio }=useBusinessSnapshot()();

const { selectedTicker }=useHoldingsStore();

if(!portfolio){

return null;

}

const transactions=

portfolio.transactions.filter(

t=>t.assetTicker===selectedTicker

);

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Transaction History

</h2>

<div className="space-y-2">

{transactions.map(tx=>(

<div

key={tx.id}

className="rounded border p-3"

>

<div className="flex justify-between">

<strong>

{tx.action}

</strong>

<span>

{tx.date}

</span>

</div>

<div className="mt-1 text-sm text-muted-foreground">

{tx.quantity} @ ${tx.price}

</div>

</div>

))}

</div>

</div>

);

}

