"use client";

import { useEffect } from "react";

import {

useMarketStatus

} from "@/core/market/state/marketStatus";

export default function useMarketRuntime(){

const {

setStatus

}=useMarketStatus();

useEffect(()=>{

setStatus(

true,

"FMP"

);

},[]);

}

