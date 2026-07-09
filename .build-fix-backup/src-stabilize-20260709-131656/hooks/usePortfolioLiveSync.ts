"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import { revaluePortfolio } from "@/core/market/liveValuation";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function usePortfolioLiveSync(){

const {

portfolio

}=usePortfolio();

const {

setHoldings

}=usePortfolioStore();

useEffect(()=>{

if(!portfolio){

return;

}

async function sync(){

const holdings=

await revaluePortfolio(

portfolio.holdings

);

setHoldings(

holdings

);

}

sync();

},[portfolio]);

}
