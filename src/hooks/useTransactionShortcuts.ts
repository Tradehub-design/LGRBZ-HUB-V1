"use client";

import { useEffect } from "react";

export default function useTransactionShortcuts(){

useEffect(()=>{

function handler(

event:KeyboardEvent

){

if(

event.ctrlKey&&

event.key==="z"

){

event.preventDefault();

}

if(

event.ctrlKey&&

event.key==="s"

){

event.preventDefault();

}

}

window.addEventListener(

"keydown",

handler

);

return()=>{

window.removeEventListener(

"keydown",

handler

);

};

},[]);

}

