"use client";

import { useBusinessSnapshot() } from "@/hooks/useBusinessSnapshot()";
import { calculateDividendAnalytics } from "@/core/dividends/analytics";

export default function DividendDashboard(){

const { portfolio }=useBusinessSnapshot()();

if(!portfolio)return null;

const d=

calculateDividendAnalytics(

portfolio

);

const cards=[

["Annual",d.annualIncome],

["Monthly",d.monthlyIncome],

["Yield",d.portfolioYield],

["Franking",d.frankingCredits]

];

return(

<div className="grid gap-6 lg:grid-cols-4">

{cards.map(([title,value])=>(

<div

key={title}

className="rounded-xl border bg-card p-5"

>

<div className="text-sm">

{title}

</div>

<div className="mt-4 text-3xl font-bold">

{Number(value).toLocaleString()}

</div>

</div>

))}

</div>

);

}
