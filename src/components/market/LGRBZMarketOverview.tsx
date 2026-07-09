"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import LivePriceBadge from "./LivePriceBadge";

export default function LGRBZMarketOverview(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 text-xl font-bold">

LGRBZ Market Overview

</h2>

<div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">

{portfolio.holdings.map(h=>(

<LivePriceBadge

key={h.ticker}

ticker={h.ticker}

/>

))}

</div>

</div>

);

}

