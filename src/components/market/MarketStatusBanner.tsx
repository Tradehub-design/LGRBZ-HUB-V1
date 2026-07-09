"use client";

import {

getMarketSession

} from "@/core/market/session";

export default function MarketStatusBanner(){

const asx=

getMarketSession(

"ASX"

);

const us=

getMarketSession(

"NASDAQ"

);

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-4">

<div className="grid gap-4 md:grid-cols-2">

<div>

<strong>

ASX

</strong>

{" • "}

{asx.status}

</div>

<div>

<strong>

US Markets

</strong>

{" • "}

{us.status}

</div>

</div>

</div>

);

}

