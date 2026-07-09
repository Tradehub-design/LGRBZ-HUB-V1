"use client";

import {

useMarketStore

} from "@/store/marketStore";

interface Props{

ticker:string;

}

export default function LivePriceBadge({

ticker

}:Props){

const quote=

useMarketStore(

s=>s.quotes[ticker]

);

if(!quote){

return(

<div className="rounded border px-3 py-1 text-xs">

Loading...

</div>

);

}

return(

<div className="rounded-lg border bg-card px-3 py-2">

<div className="font-semibold">

{ticker}

</div>

<div>

${quote.price.toFixed(2)}

</div>

<div className={

quote.change>=0

?"text-green-600"

:"text-red-600"

}>

{quote.changePercent.toFixed(2)}%

</div>

</div>

);

}

