import { create } from "zustand";

export const useImportProgressStore=

create((set)=>({

progress:0,

running:false,

setProgress:(progress:number)=>set({progress}),

setRunning:(running:boolean)=>set({running})

}));
