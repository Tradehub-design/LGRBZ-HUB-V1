"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function AssetAllocation(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

const totals=new Map<string,number>();

portfolio.holdings.forEach(h=>{

const current=

totals.get(h.assetClass)||0;

totals.set(

h.assetClass,

current+

h.metrics.marketValue

);

});

const rows=[

...totals.entries()

];

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Asset Allocation

</h2>

{rows.map(([name,value])=>(

<div

key={name}

className="flex justify-between py-2 border-b"

>

<span>{name}</span>

<span>

${value.toLocaleString()}

</span>

</div>

))}

</div>

);

}

