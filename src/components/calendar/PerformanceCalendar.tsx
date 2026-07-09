"use client";

import { useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function PerformanceCalendar(){

const {

transactions,

enableReplay

}=usePortfolioStore();

const calendar=useMemo(()=>{

const map=new Map<string,number>();

transactions.forEach(tx=>{

const value=

(tx.action==="Sell"

?tx.quantity*tx.price

:0)

-

(tx.action==="Buy"

?tx.quantity*tx.price

:0);

map.set(

tx.date,

(map.get(tx.date)??0)+value

);

});

return [...map.entries()];

},[transactions]);

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 font-semibold">

Performance Calendar

</h2>

<div className="grid grid-cols-7 gap-2">

{calendar.map(([date,value])=>(

<button

key={date}

onClick={()=>enableReplay(date)}

className={

`rounded-lg border p-3 text-left transition

${

value>=0

?"bg-green-50"

:"bg-red-50"

}`

}

>

<div className="text-xs">

{date}

</div>

<div className="mt-2 font-semibold">

${value.toFixed(0)}

</div>

</button>

))}

</div>

</div>

);

}

