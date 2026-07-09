"use client";

import { useEffect } from "react";

import {

processRetries

} from "@/core/sync/retryWorker";

import {

processSyncQueue

} from "@/core/sync/syncWorker";

export default function useEnterpriseSync(){

useEffect(()=>{

const timer=

setInterval(()=>{

processSyncQueue();

processRetries();

},5000);

return()=>{

clearInterval(timer);

};

},[]);

}

