import { create } from "zustand";

export const useMarketSnapshotStore=

create((set)=>({

snapshots:{},

update:(ticker:string,data:any)=>

set((state:any)=>({

snapshots:{

...state.snapshots,

[ticker]:data

}

}))

}));
