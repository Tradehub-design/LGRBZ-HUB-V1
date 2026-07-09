"use client";

export default function SWOTAnalysis(){

const groups=[

"Strengths",

"Weaknesses",

"Opportunities",

"Threats"

];

return(

<div className="grid gap-4 lg:grid-cols-2">

{groups.map(group=>(

<div

key={group}

className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5"

>

<h3 className="mb-4 font-semibold">

{group}

</h3>

<textarea

className="h-40 w-full rounded border p-3"

placeholder={group}

/>

</div>

))}

</div>

);

}
