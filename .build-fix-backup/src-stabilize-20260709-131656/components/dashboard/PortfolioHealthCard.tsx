"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { calculateHealth } from "@/core/health/score";

export default function PortfolioHealthCard(){

const { portfolio }=usePortfolio();

if(!portfolio) return null;

const health=

calculateHealth(

portfolio

);

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm text-muted-foreground">

Portfolio Health

</div>

<div className="mt-2 text-5xl font-bold">

{health.score}

</div>

<div className="mt-2">

{health.message}

</div>

<div className="mt-6 h-3 rounded bg-muted overflow-hidden">

<div

className="h-full rounded bg-green-500"

style={{

width:`${health.score}%`

}}

 />

</div>

</div>

);

}

