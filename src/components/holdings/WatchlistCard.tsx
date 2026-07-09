"use client";

import { Star } from "lucide-react";

export default function WatchlistCard(){

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="flex justify-between items-center">

<h2 className="font-semibold">

Conviction

</h2>

<Star size={18}/>

</div>

<select

className="mt-4 w-full rounded border p-2"

defaultValue="Medium"

>

<option>

Very High

</option>

<option>

High

</option>

<option selected>

Medium

</option>

<option>

Low

</option>

<option>

Very Low

</option>

</select>

<label className="mt-5 flex items-center gap-2">

<input type="checkbox"/>

Watchlist

</label>

</div>

);

}

