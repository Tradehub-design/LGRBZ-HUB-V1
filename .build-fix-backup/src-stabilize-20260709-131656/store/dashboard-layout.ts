"use client";

import { create } from "zustand";

export type DashboardWidgetId =
  | "hero"
  | "stats"
  | "allocation"
  | "heatmap"
  | "timeline"
  | "alerts"
  | "snapshot"
  | "command"
  | "insights";

type Store = {
  order: DashboardWidgetId[];
  moveWidget: (from:number,to:number)=>void;
};

export const useDashboardLayout=create<Store>((set)=>({

order:[
"hero",
"stats",
"command",
"allocation",
"heatmap",
"timeline",
"snapshot",
"alerts",
"insights"
],

moveWidget:(from,to)=>set((state)=>{

const copy=[...state.order]

const [item]=copy.splice(from,1)

copy.splice(to,0,item)

return{
order:copy
}

})

}))
