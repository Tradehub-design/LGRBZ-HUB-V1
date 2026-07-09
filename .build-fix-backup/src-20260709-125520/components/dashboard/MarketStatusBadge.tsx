"use client";

import {

useMarketStatus

} from "@/core/market/state/marketStatus";

export default function MarketStatusBadge(){

const {

connected,

provider,

lastSync

}=useMarketStatus();

return(

<div className="rounded-2xl border bg-card p-4 shadow-sm">

<div className="flex items-center justify-between">

<div>

<div className="text-sm text-muted-foreground">

Market Feed

</div>

<div className="mt-1 font-semibold">

{provider}

</div>

</div>

<div

className={`h-3 w-3 rounded-full ${connected?"bg-green-500":"bg-red-500"}`}

/>

</div>

<div className="mt-3 text-xs text-muted-foreground">

{lastSync}

</div>

</div>

);

}
