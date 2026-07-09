"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";
import { syncPortfolio } from "@/core/datahub/portfolioSync";

export default function useDataHub(){

const { portfolio }=usePortfolio();

useEffect(()=>{

if(!portfolio){

return;

}

const tickers=

portfolio.holdings.map(

h=>h.ticker

);

syncPortfolio(

tickers

);

const timer=

setInterval(()=>{

syncPortfolio(

tickers

);

},60000);

return()=>clearInterval(timer);

},[portfolio]);

}
