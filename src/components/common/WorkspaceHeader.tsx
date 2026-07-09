"use client";

import React from "react";


interface Props{

title:string;

description:string;

children?:React.ReactNode;

}

export default function WorkspaceHeader({

title,

description,

children

}:Props){

return(

<div className="mb-8 flex items-end justify-between">

<div>

<h1 className="text-4xl font-bold tracking-tight">

{title}

</h1>

<p className="mt-2 text-muted-foreground">

{description}

</p>

</div>

<div className="flex gap-3">

{children}

</div>

</div>

);

}
