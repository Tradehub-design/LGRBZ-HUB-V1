import { create } from "zustand";

export const useInsightStore=

create((set)=>({

insights:[],

setInsights:(insights:any[])=>

set({

insights

})

}));
