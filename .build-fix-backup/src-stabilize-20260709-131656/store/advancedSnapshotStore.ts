import { create } from "zustand";

interface AdvancedSnapshotState{

snapshot:any;

setSnapshot:(

snapshot:any

)=>void;

}

export const useAdvancedSnapshotStore=

create<AdvancedSnapshotState>((set)=>({

snapshot:null,

setSnapshot:(snapshot)=>

set({

snapshot

})

}));
