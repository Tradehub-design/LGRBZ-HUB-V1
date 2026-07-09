"use client";

import { useTimelineStore } from "@/store/timelineStore";

export default function PortfolioTimeline(){

const { events }=

useTimelineStore();

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 text-xl font-semibold">

Today In Your Portfolio

</h2>

<div className="space-y-4">

{events.map((event:any)=>(

<div

key={event.id}

className="rounded-lg border p-4"

>

<div className="font-semibold">

{event.title}

</div>

<div className="text-sm text-muted-foreground mt-1">

{event.description}

</div>

</div>

))}

</div>

</div>

);

}
