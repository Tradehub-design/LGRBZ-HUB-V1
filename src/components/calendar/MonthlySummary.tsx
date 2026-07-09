"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function MonthlySummary(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

const months=new Map<string,number>();

portfolio.timeline.forEach(point=>{

const month=

point.date.substring(0,7);

months.set(

month,

(months.get(month)||0)+

point.profit

);

});

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Monthly Performance

</h2>

{[...months.entries()].map(([m,v])=>(

<div

key={m}

className="flex justify-between border-b py-2"

>

<span>{m}</span>

<span>

${v.toLocaleString()}

</span>

</div>

))}

</div>

);

}

