"use client";

import BentoCard from "@/components/ui/cards/BentoCard";
import { useBusinessSnapshot } from "@/core/business/hooks/useBusinessSnapshot";

export default function PortfolioOverviewWidget(){

const {

snapshot

}=useBusinessSnapshot();

if(!snapshot){

return null;

}

return(

<BentoCard

title="Portfolio Overview"

className="h-full"

>

<div className="grid grid-cols-2 gap-6">

<div>

<div className="text-sm text-muted-foreground">

Portfolio Value

</div>

<div className="mt-2 text-4xl font-bold">

${snapshot.portfolioValue.toLocaleString()}

</div>

</div>

<div>

<div className="text-sm text-muted-foreground">

Return

</div>

<div className="mt-2 text-4xl font-bold">

{snapshot.returnPercent.toFixed(2)}%

</div>

</div>

<div>

<div className="text-sm">

Cash

</div>

<div className="mt-2 text-3xl font-semibold">

${snapshot.cash.toLocaleString()}

</div>

</div>

<div>

<div className="text-sm">

Positions

</div>

<div className="mt-2 text-3xl font-semibold">

{snapshot.positions}

</div>

</div>

</div>

</BentoCard>

);

}
