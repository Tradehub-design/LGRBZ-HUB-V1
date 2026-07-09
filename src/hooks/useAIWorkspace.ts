"use client";

import { useEffect } from "react";

import { usePortfolio }

from "@/hooks/usePortfolio";

import {

useSnapshotStore

} from "@/store/snapshotStore";

import {

buildAIWorkspace

} from "@/core/ai/services/buildWorkspace";

import {

useAIWorkspaceStore

} from "@/store/ai/workspaceStore";

export default function useAIWorkspace(){

const { portfolio }=

usePortfolio();

const snapshot=

useSnapshotStore(

s=>s.snapshot

);

const { setWorkspace }=

useAIWorkspaceStore();

useEffect(()=>{

if(

!portfolio||

!snapshot

){

return;

}

setWorkspace(

buildAIWorkspace(

portfolio as any,

snapshot

)

);

},[portfolio as any,snapshot]);

}
