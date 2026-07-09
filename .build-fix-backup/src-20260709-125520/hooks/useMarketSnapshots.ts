"use client";

import { useEffect } from "react";

import { usePortfolio }

from "@/hooks/usePortfolio";

import { fullSnapshot }

from "@/core/market/services/fullSnapshot";

import {

useMarketSnapshotStore

} from "@/store/marketSnapshotStore";

export default function useMarketSnapshots(){

const { portfolio }=

usePortfolio();

const {

update

}=useMarketSnapshotStore();

useEffect(()=>{

if(!portfolio){

return;

}

portfolio.holdings.forEach(async holding=>{

const snapshot=

await fullSnapshot(

holding.ticker

);

update(

holding.ticker,

snapshot

);

});

},[portfolio]);

}
