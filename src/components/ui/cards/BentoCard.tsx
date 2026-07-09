"use client";

import { ReactNode } from "react";

interface Props{

title:string;

children:ReactNode;

className?:string;

}

export default function BentoCard({

title,

children,

className=""

}:Props){

return(

<div className={`rounded-2xl border bg-card p-6 shadow-sm ${className}`}>

<div className="mb-5">

<h2 className="text-lg font-semibold">

{title}

</h2>

</div>

{children}

</div>

);

}
