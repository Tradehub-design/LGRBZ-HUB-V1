"use client";

import {

Play,

Pause,

SkipBack,

SkipForward

} from "lucide-react";

import {

useEffect

} from "react";

import {

useReplayPlayerStore

} from "@/store/replayPlayerStore";

import {

usePortfolioStore

} from "@/store/portfolioStore";

export default function ReplayPlayer(){

const replay=

useReplayPlayerStore();

const portfolio=

usePortfolioStore();

const dates=[

...new Set(

portfolio.transactions.map(

t=>t.date

)

)

].sort();

useEffect(()=>{

if(!replay.playing){

return;

}

const timer=setInterval(()=>{

const next=

replay.currentIndex+1;

if(next>=dates.length){

replay.pause();

return;

}

replay.setIndex(next);

portfolio.enableReplay(

dates[next]

);

},1000/replay.speed);

return()=>clearInterval(timer);

},[

replay.playing,

replay.currentIndex,

replay.speed,

dates

]);

return(

<div className="flex items-center gap-2">

<button

onClick={replay.previous}

>

<SkipBack/>

</button>

<button

onClick={replay.toggle}

>

{replay.playing

?<Pause/>

:<Play/>}

</button>

<button

onClick={replay.next}

>

<SkipForward/>

</button>

<select

value={replay.speed}

onChange={(e)=>

replay.setSpeed(

Number(

e.target.value

)

)

}

>

<option value={0.25}>0.25x</option>

<option value={0.5}>0.5x</option>

<option value={1}>1x</option>

<option value={2}>2x</option>

<option value={4}>4x</option>

<option value={8}>8x</option>

</select>

</div>

);

}

