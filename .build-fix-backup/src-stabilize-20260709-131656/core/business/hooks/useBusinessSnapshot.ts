"use client";

import { useSnapshotStore } from "@/store/snapshotStore";
import { buildPortfolioMetrics } from "../metrics/portfolioMetrics";

export function useBusinessSnapshot(){

const snapshot=

useSnapshotStore(

s=>s.snapshot

);

return{

snapshot,

metrics:

snapshot

?buildPortfolioMetrics(

snapshot

)

:null

};

}

