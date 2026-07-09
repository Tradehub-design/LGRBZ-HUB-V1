"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";
import { useHoldingsStore } from "@/store/holdingsStore";

export default function CompanyProfile(){

const { portfolio } = useBusinessSnapshot();
const { selectedTicker } = useHoldingsStore();

const holding=

portfolio?.holdings.find(

h=>h.ticker===selectedTicker

);

if(!holding){

return null;

}

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="flex items-center justify-between">

<h2 className="text-xl font-semibold">

AI Company Profile

</h2>

<div className="rounded-full bg-primary/10 px-3 py-1 text-xs">

AI

</div>

</div>

<div className="mt-5 space-y-4">

<div>

<div className="text-xs text-muted-foreground">

Company

</div>

<div className="font-semibold">

{holding.company}

</div>

</div>

<div className="grid grid-cols-2 gap-4">

<div>

<div className="text-xs">

Sector

</div>

<div>

{holding.sector}

</div>

</div>

<div>

<div className="text-xs">

Industry

</div>

<div>

{holding.industry}

</div>

</div>

<div>

<div className="text-xs">

Country

</div>

<div>

{holding.country}

</div>

</div>

<div>

<div className="text-xs">

Risk

</div>

<div>

{holding.risk}

</div>

</div>

</div>

<div>

<div className="text-xs text-muted-foreground">

AI Summary

</div>

<p className="mt-2 text-sm">

AI generated company overview will appear here automatically after
ticker recognition.

</p>

</div>

</div>

</div>

);

}

