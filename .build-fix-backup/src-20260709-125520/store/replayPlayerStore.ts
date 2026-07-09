import { create } from "zustand";

interface ReplayPlayerState{

playing:boolean;

speed:number;

currentIndex:number;

play:()=>void;

pause:()=>void;

toggle:()=>void;

setSpeed:(speed:number)=>void;

setIndex:(index:number)=>void;

next:()=>void;

previous:()=>void;

}

export const useReplayPlayerStore=create<ReplayPlayerState>((set,get)=>({

playing:false,

speed:1,

currentIndex:0,

play:()=>set({playing:true}),

pause:()=>set({playing:false}),

toggle:()=>set({

playing:!get().playing

}),

setSpeed:(speed)=>set({speed}),

setIndex:(currentIndex)=>set({currentIndex}),

next:()=>set({

currentIndex:get().currentIndex+1

}),

previous:()=>set({

currentIndex:Math.max(

0,

get().currentIndex-1

)

})

}));

