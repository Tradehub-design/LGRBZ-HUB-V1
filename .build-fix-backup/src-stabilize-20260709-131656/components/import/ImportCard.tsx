"use client";

export default function ImportCard(){

return(

<div className="rounded-2xl border bg-card p-6">

<h2 className="text-xl font-semibold">

Import Transactions

</h2>

<p className="mt-2 text-muted-foreground">

CSV

Excel

Broker exports

MT5

Future integrations

</p>

<button

className="mt-6 rounded-xl border px-5 py-3"

>

Import File

</button>

</div>

);

}

