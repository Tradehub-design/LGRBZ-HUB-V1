"use client";

import { useEffect } from "react";

import { usePortfolio }

from "@/hooks/usePortfolio";

import {

useSnapshotStore

} from "@/store/snapshotStore";

import {

buildAISummary

} from "@/core/ai/services/dashboardSummary";

import {

useAISummaryStore

} from "@/store/ai/summaryStore";

export default function useAISummary(){

const { portfolio }=

usePortfolio();

const snapshot=

useSnapshotStore(

s=>s.snapshot

);

const { setSummary }=

useAISummaryStore();

useEffect(()=>{

if(

!portfolio||

!snapshot

){

return;

}

setSummary(

buildAISummary(

portfolio,

snapshot

)

);

},[portfolio,snapshot]);

}
