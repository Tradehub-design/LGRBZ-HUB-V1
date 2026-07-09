"use client";

export default function HoldingsFilters(){

return(

<div className="grid gap-4 lg:grid-cols-6">

<select className="rounded-lg border p-2">

<option>All Accounts</option>

</select>

<select className="rounded-lg border p-2">

<option>All Brokers</option>

</select>

<select className="rounded-lg border p-2">

<option>All Asset Classes</option>

</select>

<select className="rounded-lg border p-2">

<option>All Sectors</option>

</select>

<select className="rounded-lg border p-2">

<option>All Strategies</option>

</select>

<input

className="rounded-lg border p-2"

placeholder="Search ticker..."

 />

</div>

);

}

