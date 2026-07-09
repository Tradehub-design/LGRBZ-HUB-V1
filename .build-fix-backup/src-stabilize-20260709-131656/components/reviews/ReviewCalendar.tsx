"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { useReviewStore } from "@/store/reviewStore";

export default function ReviewCalendar(){

const { portfolio }=usePortfolio();
const { select }=useReviewStore();

if(!portfolio)return null;

const dates=[

...new Set(

portfolio.transactions.map(

t=>t.date

)

)

];

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 font-semibold">

Review Calendar

</h2>

<div className="grid grid-cols-7 gap-2">

{dates.map(date=>(

<button

key={date}

onClick={()=>select(date)}

className="rounded border p-3 hover:bg-muted"

>

{date}

</button>

))}

</div>

</div>

);

}
