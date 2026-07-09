import { create } from "zustand";

export const useAISummaryStore=

create((set)=>({

summary:null,

setSummary:(summary:any)=>

set({

summary

})

}));
