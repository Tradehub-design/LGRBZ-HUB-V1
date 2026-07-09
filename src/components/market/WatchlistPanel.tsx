"use client";

import { useWatchlistStore } from "@/store/watchlistStore";
import LivePriceBadge from "./LivePriceBadge";

export default function WatchlistPanel(){

const { items }=useWatchlistStore();

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 text-xl font-bold">

Watchlist

</h2>

<div className="space-y-3">

{items.map(item=>(

<LivePriceBadge

key={item.ticker}

ticker={item.ticker}

/>

))}

</div>

</div>

);

}

