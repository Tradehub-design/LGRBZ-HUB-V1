"use client";

import {

useReplayPlayerStore

} from "@/store/replayPlayerStore";

import {

usePortfolioStore

} from "@/store/portfolioStore";

export default function ReplayProgress(){

const replay=

useReplayPlayerStore();

const portfolio=

usePortfolioStore();

const total=

new Set(

portfolio.transactions.map(

t=>t.date

)

).size;

const percent=

total===0

?0

:(

replay.currentIndex/

(total-1)

)*100;

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-4">

<div className="mb-2 text-sm">

Replay Progress

</div>

<div className="h-3 rounded bg-muted">

<div

className="h-full rounded bg-primary transition-all duration-500"

style={{

width:`${percent}%`

}}

 />

</div>

</div>

);

}

