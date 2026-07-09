"use client";

export default function TransactionsFilters(){

return(

<div className="grid gap-3 lg:grid-cols-8">

<select className="rounded-lg border p-2">

<option>All Accounts</option>

</select>

<select className="rounded-lg border p-2">

<option>All Brokers</option>

</select>

<select className="rounded-lg border p-2">

<option>All Asset Types</option>

</select>

<select className="rounded-lg border p-2">

<option>All Strategies</option>

</select>

<select className="rounded-lg border p-2">

<option>All Actions</option>

</select>

<input

className="rounded-lg border p-2"

placeholder="Ticker"

/>

<input

className="rounded-lg border p-2"

placeholder="Company"

/>

<input

className="rounded-lg border p-2"

placeholder="Search notes"

/>

</div>

);

}

