"use client";

import { useRef } from "react";

interface Props{
onSelect:(file:File)=>void;
}

export default function ImportDropzone({
onSelect
}:Props){

const input=useRef<HTMLInputElement>(null);

return(

<div
className="rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer hover:bg-muted/40 transition"
onClick={()=>input.current?.click()}
onDragOver={(e)=>e.preventDefault()}
onDrop={(e)=>{
e.preventDefault();
const file=e.dataTransfer.files[0];
if(file){
onSelect(file);
}
}}
>

<input
hidden
ref={input}
type="file"
accept=".csv,.xlsx,.xls"
onChange={(e)=>{
const file=e.target.files?.[0];
if(file){
onSelect(file);
}
}}
/>

<h2 className="text-2xl font-semibold">

Drop broker statement here

</h2>

<p className="mt-3 text-muted-foreground">

CSV • Excel • MT5 • Broker Exports

</p>

</div>

);

}
