"use client";

import { useBusinessSnapshot } from "@/core/business/hooks/useBusinessSnapshot";

export default function HoldingsSummary(){

const { snapshot }=

useBusinessSnapshot();

if(!snapshot)return null;

const cards=[

["Portfolio",

`$${snapshot.portfolioValue.toLocaleString()}`],

["Invested",

`$${snapshot.marketValue.toLocaleString()}`],

["Cash",

`$${snapshot.cash.toLocaleString()}`],

["Positions",

snapshot.positions.toString()]

];

return(

<div className="grid gap-6 grid-cols-2 xl:grid-cols-4">

{cards.map(([title,value])=>(

<div

key={title}

className="rounded-2xl border bg-card p-6 shadow-sm"

>

<div className="text-sm text-muted-foreground">

{title}

</div>

<div className="mt-4 text-3xl font-bold">

{value}

</div>

</div>

))}

</div>

);

}
