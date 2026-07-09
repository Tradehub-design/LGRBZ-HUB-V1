"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot()";

export default function RollingReturns(){

const { portfolio }=useBusinessSnapshot()();

if(!portfolio){

return null;

}

const periods=[

"1 Month",

"3 Months",

"6 Months",

"1 Year",

"3 Years",

"5 Years"

];

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-4 font-semibold">

Rolling Returns

</h2>

<div className="space-y-3">

{periods.map(period=>(

<div

key={period}

className="flex justify-between"

>

<span>{period}</span>

<span>--</span>

</div>

))}

</div>

</div>

);

}

