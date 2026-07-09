"use client";

import {

useIntelligenceStore

} from "@/store/intelligenceStore";

export default function PortfolioIntelligence(){

const {

cards

}=useIntelligenceStore();

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 text-xl font-semibold">

Portfolio Intelligence

</h2>

<div className="space-y-3">

{cards.map(card=>(

<div

key={card.id}

className="rounded-lg border p-4"

>

<div className="font-semibold">

{card.title}

</div>

<div className="mt-2 text-sm text-muted-foreground">

{card.description}

</div>

</div>

))}

</div>

</div>

);

}

