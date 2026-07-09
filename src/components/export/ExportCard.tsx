"use client";

export default function ExportCard(){

return(

<div className="rounded-2xl border bg-card p-6">

<h2 className="text-xl font-semibold">

Export Portfolio

</h2>

<div className="mt-5 flex gap-3">

<button className="rounded-xl border px-4 py-2">

CSV

</button>

<button className="rounded-xl border px-4 py-2">

JSON

</button>

<button className="rounded-xl border px-4 py-2">

PDF

</button>

</div>

</div>

);

}

