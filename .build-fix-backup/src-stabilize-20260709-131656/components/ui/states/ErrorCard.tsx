"use client";

export default function ErrorCard({

message

}:{

message:string;

}){

return(

<div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

<div className="font-semibold text-red-500">

Something went wrong

</div>

<div className="mt-2">

{message}

</div>

</div>

);

}

