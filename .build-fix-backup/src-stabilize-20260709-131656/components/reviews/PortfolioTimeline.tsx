"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function PortfolioTimeline(){

const { portfolio }=usePortfolio();

if(!portfolio)return null;

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 font-semibold">

Portfolio Timeline

</h2>

<div className="space-y-3">

{portfolio.timeline.map(point=>(

<div

key={point.date}

className="flex justify-between border-b py-2"

>

<div>{point.date}</div>

<div>

${point.portfolioValue.toLocaleString()}

</div>

</div>

))}

</div>

</div>

);

}
