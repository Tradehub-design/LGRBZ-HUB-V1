"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function ReplayBanner(){

const {

replay,

snapshot

}=usePortfolio();

if(!replay){

return null;

}

return(

<div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4">

<div className="font-semibold">

Replay Mode Enabled

</div>

<div className="text-sm text-muted-foreground">

Viewing portfolio on

<strong>

{" "}

{snapshot?.date}

</strong>

</div>

</div>

);

}

