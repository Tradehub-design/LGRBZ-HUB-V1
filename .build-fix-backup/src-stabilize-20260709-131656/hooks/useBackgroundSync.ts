"use client";

import { useEffect } from "react";

import {

processSyncQueue

} from "@/core/sync/syncWorker";

export default function useBackgroundSync(){

useEffect(()=>{

const timer=

setInterval(

processSyncQueue,

10000

);

return()=>{

clearInterval(

timer

);

};

},[]);

}
