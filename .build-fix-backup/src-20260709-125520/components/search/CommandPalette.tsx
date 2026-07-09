"use client";

import { useEffect } from "react";

import { useCommandStore } from "@/store/commandStore";

export default function CommandPalette(){

const command=

useCommandStore();

useEffect(()=>{

function handler(

event:KeyboardEvent

){

if(

(event.ctrlKey||event.metaKey)

&&

event.key==="k"

){

event.preventDefault();

command.setOpen(

!command.open

);

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

},[command]);

if(!command.open){

return null;

}

return(

<div className="fixed inset-0 z-50 bg-black/40">

<div className="mx-auto mt-24 max-w-2xl rounded-2xl bg-background shadow-xl">

<input

autoFocus

placeholder="Search LGRBZ..."

value={command.query}

onChange={(e)=>

command.setQuery(

e.target.value

)

}

className="w-full border-b p-5 text-xl"

/>

<div className="p-5 text-muted-foreground">

Start typing to search...

</div>

</div>

</div>

);

}

