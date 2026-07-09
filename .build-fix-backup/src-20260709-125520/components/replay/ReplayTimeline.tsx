"use client";

import { useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function ReplayTimeline(){

const {

transactions,

replayEnabled,

replayDate,

enableReplay

}=usePortfolioStore();

const dates=useMemo(()=>{

const unique=new Set<string>();

transactions.forEach(t=>{

unique.add(t.date);

});

return [...unique].sort();

},[transactions]);

if(dates.length===0){

return null;

}

const index=Math.max(

0,

dates.indexOf(replayDate ?? dates[0])

);

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="mb-4 flex items-center justify-between">

<h2 className="font-semibold">

Portfolio Replay

</h2>

<div className="text-sm text-muted-foreground">

{replayEnabled

?replayDate

:"Live"}

</div>

</div>

<input

type="range"

min={0}

max={dates.length-1}

value={index}

className="w-full"

onChange={(e)=>{

enableReplay(

dates[

Number(e.target.value)

]

);

}}

/>

</div>

);

}

