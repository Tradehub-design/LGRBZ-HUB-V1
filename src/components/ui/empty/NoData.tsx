"use client";

export default function NoData({

title,

message

}:{

title:string;

message:string;

}){

return(

<div className="rounded-2xl border border-dashed p-16 text-center">

<h2 className="text-2xl font-semibold">

{title}

</h2>

<p className="mt-3 text-muted-foreground">

{message}

</p>

</div>

);

}

