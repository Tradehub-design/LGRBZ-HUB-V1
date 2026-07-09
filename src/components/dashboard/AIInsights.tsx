"use client";

import {

useInsightStore

} from "@/store/ai/insightStore";

export default function AIInsights(){

const {

insights

}=useInsightStore();

return(

<div className="rounded-2xl border bg-card p-6 shadow-sm">

<h2 className="mb-5 text-lg font-semibold">

AI Portfolio Insights

</h2>

<div className="space-y-4">

{insights.map((i:any)=>(

<div

key={i.id}

className="rounded-xl border p-4"

>

<div className="font-semibold">

{i.title}

</div>

<div className="mt-2 text-sm text-muted-foreground">

{i.summary}

</div>

</div>

))}

</div>

</div>

);

}
