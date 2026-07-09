import { create } from "zustand";

interface HoldingsState{

selectedTicker:string|null;

expandedLots:boolean;

selectHolding:(ticker:string)=>void;

clearSelection:()=>void;

toggleLots:()=>void;

}

export const useHoldingsStore=create<HoldingsState>((set,get)=>({

selectedTicker:null,

expandedLots:true,

selectHolding:(ticker)=>set({

selectedTicker:ticker

}),

clearSelection:()=>set({

selectedTicker:null

}),

toggleLots:()=>set({

expandedLots:!get().expandedLots

})

}));

