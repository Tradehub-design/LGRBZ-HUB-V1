"use client";

interface Props{

title:string;

value:string;

subtitle?:string;

}

export default function PortfolioKPICard({

title,

value,

subtitle

}:Props){

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">

<div className="text-xs uppercase tracking-wide text-muted-foreground">

{title}

</div>

<div className="mt-2 text-3xl font-bold">

{value}

</div>

{subtitle&&(

<div className="mt-2 text-sm text-muted-foreground">

{subtitle}

</div>

)}

</div>

);

}

