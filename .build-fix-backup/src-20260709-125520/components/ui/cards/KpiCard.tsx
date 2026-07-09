"use client";

interface Props{

title:string;

value:string;

change?:string;

}

export default function KpiCard({

title,

value,

change

}:Props){

return(

<div className="rounded-2xl border bg-card p-6">

<div className="text-sm text-muted-foreground">

{title}

</div>

<div className="mt-5 text-4xl font-bold">

{value}

</div>

{change&&(

<div className="mt-3 text-sm">

{change}

</div>

)}

</div>

);

}
