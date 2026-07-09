import { create } from "zustand";

import type {

PortfolioSnapshot

} from "@/core/business/models/PortfolioSnapshot";

interface SnapshotState{

snapshot:PortfolioSnapshot|null;

setSnapshot:(

snapshot:PortfolioSnapshot

)=>void;

}

export const useSnapshotStore=

create<SnapshotState>((set)=>({

snapshot:null,

setSnapshot:(snapshot)=>

set({

snapshot

})

}));

