"use client";

import { useEffect } from "react";

import { usePortfolio }

from "@/hooks/usePortfolio";

import { useSnapshotStore }

from "@/store/snapshotStore";

import { buildInsights }

from "@/core/ai/services/buildInsights";

import { useInsightStore }

from "@/store/ai/insightStore";

export default function useAIEngine(){

const { portfolio }=

usePortfolio();

const snapshot=

useSnapshotStore(

s=>s.snapshot

);

const { setInsights }=

useInsightStore();

useEffect(()=>{

if(

!portfolio||

!snapshot

){

return;

}

setInsights(

buildInsights(

portfolio as any,

snapshot

)

);

},[portfolio as any,snapshot]);

}
