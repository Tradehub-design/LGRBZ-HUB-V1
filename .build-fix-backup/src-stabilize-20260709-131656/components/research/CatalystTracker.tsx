"use client";

import { useResearchStore } from "@/store/researchStore";

export default function CatalystTracker(){

const {

catalysts

}=useResearchStore();

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Catalysts

</h2>

<div className="space-y-3">

{catalysts.map(c=>(

<div

key={c.id}

className="rounded border p-3"

>

<div className="flex justify-between">

<strong>

{c.title}

</strong>

<span>

{c.date}

</span>

</div>

<div className="mt-2 text-sm">

Impact:

{c.impact}

</div>

</div>

))}

</div>

</div>

);

}
