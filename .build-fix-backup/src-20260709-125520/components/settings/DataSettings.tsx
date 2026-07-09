"use client";

export default function DataSettings(){

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-6">

<h2 className="mb-5 text-xl font-bold">

Data Management

</h2>

<div className="grid gap-4 md:grid-cols-2">

<button className="rounded-lg border p-4">

Export Portfolio

</button>

<button className="rounded-lg border p-4">

Backup Database

</button>

<button className="rounded-lg border p-4">

Restore Backup

</button>

<button className="rounded-lg border p-4">

Download Reports

</button>

</div>

</div>

);

}
