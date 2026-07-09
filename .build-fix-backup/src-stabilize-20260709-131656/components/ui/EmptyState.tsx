"use client";

interface Props{

title:string;

description:string;

}

export default function EmptyState({

title,

description

}:Props){

return(

<div className="rounded-xl border border-dashed bg-card shadow-sm p-12 text-center">

<h2 className="text-2xl font-semibold">

{title}

</h2>

<p className="mt-3 text-muted-foreground">

{description}

</p>

</div>

);

}
