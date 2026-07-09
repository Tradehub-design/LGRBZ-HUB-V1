"use client";

interface Props{

value:string|number;

onChange:(value:string)=>void;

}

export default function EditableCell({

value,

onChange

}:Props){

return(

<input

defaultValue={String(value)}

onBlur={(e)=>onChange(e.target.value)}

className="w-full rounded border-0 bg-transparent px-2 py-1 hover:bg-muted focus:bg-background"

/>

);

}

