"use client";

import {

useProviderMonitor

} from "@/core/market/health/providerMonitor";

export default function ProviderHealth(){

const {

providers

}=useProviderMonitor();

return(

<div className="rounded-2xl border bg-card p-6 shadow-sm">

<h2 className="mb-4 text-lg font-semibold">

Providers

</h2>

<div className="space-y-3">

{providers.map(provider=>(

<div

key={provider.name}

className="flex justify-between"

>

<div>

{provider.name}

</div>

<div>

{provider.online

?"🟢"

:"🔴"}

{" "}

{provider.latency} ms

</div>

</div>

))}

</div>

</div>

);

}
