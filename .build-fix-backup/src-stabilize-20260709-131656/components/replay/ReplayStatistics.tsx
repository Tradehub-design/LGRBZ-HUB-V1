"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function ReplayStatistics(){

const {

portfolio,

snapshot,

replay

}=usePortfolio();

if(!portfolio){

return null;

}

const holdings=

replay

?snapshot?.holdings??[]

:portfolio.holdings;

const cash=

replay

?snapshot?.cash.totalCash??0

:portfolio.cash.totalCash;

return(

<div className="grid gap-4 md:grid-cols-3">

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm">

Holdings

</div>

<div className="mt-2 text-3xl font-bold">

{holdings.length}

</div>

</div>

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm">

Cash

</div>

<div className="mt-2 text-3xl font-bold">

${cash.toLocaleString()}

</div>

</div>

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm">

Replay

</div>

<div className="mt-2 text-xl font-bold">

{replay

?"Historical"

:"Live"}

</div>

</div>

</div>

);

}

