"use client";

import {

ChevronLeft,

ChevronRight,

RotateCcw

} from "lucide-react";

import {

usePortfolioStore

} from "@/store/portfolioStore";

export default function ReplayControls(){

const {

transactions,

replayDate,

enableReplay,

disableReplay

}=usePortfolioStore();

const dates=[

...new Set(

transactions.map(

t=>t.date

)

)

].sort();

const index=

Math.max(

0,

dates.indexOf(

replayDate??

dates[0]

)

);

return(

<div className="flex gap-2">

<button

className="rounded border p-2"

onClick={()=>{

if(index>0){

enableReplay(

dates[index-1]

);

}

}}

>

<ChevronLeft size={18}/>

</button>

<button

className="rounded border p-2"

onClick={disableReplay}

>

<RotateCcw size={18}/>

</button>

<button

className="rounded border p-2"

onClick={()=>{

if(index<dates.length-1){

enableReplay(

dates[index+1]

);

}

}}

>

<ChevronRight size={18}/>

</button>

</div>

);

}

