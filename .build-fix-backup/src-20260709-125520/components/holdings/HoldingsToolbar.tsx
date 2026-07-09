"use client";

import {

Download,

RefreshCw,

Search,

Settings2

} from "lucide-react";

export default function HoldingsToolbar(){

return(

<div className="flex flex-wrap items-center justify-between gap-4">

<div>

<h1 className="text-3xl font-bold">

Holdings

</h1>

<p className="text-muted-foreground">

Professional Portfolio Workspace

</p>

</div>

<div className="flex gap-2">

<button className="rounded-lg border p-2">

<Search size={18}/>

</button>

<button className="rounded-lg border p-2">

<RefreshCw size={18}/>

</button>

<button className="rounded-lg border p-2">

<Download size={18}/>

</button>

<button className="rounded-lg border p-2">

<Settings2 size={18}/>

</button>

</div>

</div>

);

}

