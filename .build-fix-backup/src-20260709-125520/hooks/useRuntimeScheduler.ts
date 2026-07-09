"use client";

import { useEffect } from "react";

import {

scheduler

} from "@/core/market/scheduler/runtimeScheduler";

export default function useRuntimeScheduler(){

useEffect(()=>{

const timer=

scheduler(

"ASX",

()=>{}

);

return()=>{

clearInterval(timer);

};

},[]);

}
