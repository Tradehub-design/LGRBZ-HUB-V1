"use client";

import {

useMarketSnapshotStore

} from "@/store/marketSnapshotStore";

export default function LiveMarketFeed(){

const {

snapshots

}=useMarketSnapshotStore();

const items=

Object.entries(

snapshots

);

return(

<div className="rounded-2xl border bg-card p-6 shadow-sm">

<h2 className="mb-5 text-lg font-semibold">

Live Market Feed

</h2>

<div className="space-y-4">

{items.map(([ticker])=>(

<div

key={ticker}

className="flex justify-between"

>

<div>

{ticker}

</div>

<div>

LIVE

</div>

</div>

))}

</div>

</div>

);

}
