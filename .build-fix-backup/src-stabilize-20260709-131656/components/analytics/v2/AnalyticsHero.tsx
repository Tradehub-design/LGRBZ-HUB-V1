"use client";

import { useBusinessSnapshot } from "@/core/business/hooks/useBusinessSnapshot";

export default function AnalyticsHero(){

const { metrics }=

useBusinessSnapshot();

if(!metrics)return null;

return(

<div className="rounded-2xl border bg-card p-8 shadow-sm">

<h2 className="text-3xl font-bold">

Portfolio Analytics

</h2>

<div className="mt-8 grid grid-cols-2 xl:grid-cols-5 gap-6">

<div>

<div className="text-sm text-muted-foreground">

Total Return

</div>

<div className="mt-2 text-3xl font-bold">

{metrics.totalReturn.toFixed(2)}%

</div>

</div>

<div>

<div className="text-sm text-muted-foreground">

Cash

</div>

<div className="mt-2 text-3xl font-bold">

{metrics.cashAllocation.toFixed(1)}%

</div>

</div>

<div>

<div className="text-sm text-muted-foreground">

Invested

</div>

<div className="mt-2 text-3xl font-bold">

{metrics.investedAllocation.toFixed(1)}%

</div>

</div>

<div>

<div className="text-sm text-muted-foreground">

Yield

</div>

<div className="mt-2 text-3xl font-bold">

{metrics.dividendYield.toFixed(2)}%

</div>

</div>

<div>

<div className="text-sm text-muted-foreground">

Profit

</div>

<div className="mt-2 text-3xl font-bold">

${metrics.profitFactor.toLocaleString()}

</div>

</div>

</div>

</div>

);

}
