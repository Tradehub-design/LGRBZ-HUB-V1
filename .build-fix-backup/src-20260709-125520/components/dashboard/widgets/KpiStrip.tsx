"use client";

import KpiCard from "@/components/ui/cards/KpiCard";
import { useBusinessSnapshot } from "@/core/business/hooks/useBusinessSnapshot";

export default function KpiStrip(){

const {

snapshot

}=useBusinessSnapshot();

if(!snapshot){

return null;

}

return(

<div className="grid gap-6 grid-cols-2 xl:grid-cols-4">

<KpiCard

title="Market Value"

value={`$${snapshot.marketValue.toLocaleString()}`}

/>

<KpiCard

title="Unrealised"

value={`$${snapshot.unrealisedPnL.toLocaleString()}`}

/>

<KpiCard

title="Dividends"

value={`$${snapshot.dividends.toLocaleString()}`}

/>

<KpiCard

title="Cash"

value={`$${snapshot.cash.toLocaleString()}`}

/>

</div>

);

}
