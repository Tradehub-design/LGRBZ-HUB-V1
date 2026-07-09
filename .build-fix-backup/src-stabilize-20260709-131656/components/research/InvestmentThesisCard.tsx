"use client";

import { useResearchStore } from "@/store/researchStore";

export default function InvestmentThesisCard(){

const {

thesis

}=useResearchStore();

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 font-semibold">

Investment Thesis

</h2>

<div className="space-y-5">

{thesis.map(item=>(

<div

key={item.ticker}

className="rounded border p-4"

>

<h3 className="font-bold">

{item.ticker}

</h3>

<p className="mt-3">

{item.summary}

</p>

<div className="mt-4 text-sm">

Conviction:

<strong>

{" "}

{item.conviction}/10

</strong>

</div>

</div>

))}

</div>

</div>

);

}
