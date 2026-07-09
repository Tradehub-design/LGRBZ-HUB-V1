"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

refreshPortfolio

} from "@/core/market/services/refreshPortfolio";

export default function usePortfolioRefresh(){

const { portfolio }=

usePortfolio();

useEffect(()=>{

if(!portfolio){

return;

}

const refresh=()=>{

refreshPortfolio(

portfolio.holdings.map(

h=>h.ticker

)

);

};

refresh();

const timer=

setInterval(

refresh,

30000

);

return()=>{

clearInterval(timer);

};

},[portfolio]);

}
