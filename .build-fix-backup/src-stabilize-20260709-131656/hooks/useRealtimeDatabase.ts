"use client";

import { useEffect } from "react";

import {

subscribe,

unsubscribeAll

} from "@/core/database/liveSubscriptions";

export default function useRealtimeDatabase(){

useEffect(()=>{

subscribe(

"transactions",

()=>{}

);

subscribe(

"holdings",

()=>{}

);

return()=>{

unsubscribeAll();

};

},[]);

}
