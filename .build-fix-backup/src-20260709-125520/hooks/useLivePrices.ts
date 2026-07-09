"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

refreshPortfolio

} from "@/core/market/refresh";

export default function useLivePrices(){

const {

portfolio

}=usePortfolio();

useEffect(()=>{

if(!portfolio){

return;

}

const tickers=

portfolio.holdings.map(

h=>h.ticker

);

refreshPortfolio(

tickers

);

const timer=

setInterval(()=>{

refreshPortfolio(

tickers

);

},30000);

return()=>clearInterval(timer);

},[portfolio]);

}

