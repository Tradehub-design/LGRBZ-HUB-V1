"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function DashboardHeader(){

const {

replay,

snapshot

}=usePortfolio();

return(

<div className="mb-6">

<h1 className="text-3xl font-bold">

TradeHub Professional

</h1>

<p className="text-muted-foreground">

{replay

?`Replay Mode • ${snapshot?.date}`

:"Live Portfolio"}

</p>

</div>

);

}

