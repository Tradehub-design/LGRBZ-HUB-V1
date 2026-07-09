import { create } from "zustand";

export const useDashboardSummaryStore=

create((set)=>({

summary:null,

setSummary:(summary:any)=>set({

summary

})

}));
