"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function SectorAllocation(){

const { portfolio }=usePortfolio();

if(!portfolio) return null;

const sectors=new Map<string,number>();

portfolio.holdings.forEach(h=>{

const value=

h.metrics.marketValue;

const previous=

sectors.get(h.sector)||0;

sectors.set(

h.sector,

previous+value

);

});

const rows=[

...sectors.entries()

].sort(

(a,b)=>b[1]-a[1]

);

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Sector Allocation

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

