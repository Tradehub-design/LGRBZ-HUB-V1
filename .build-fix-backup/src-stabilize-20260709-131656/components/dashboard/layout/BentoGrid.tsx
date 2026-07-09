"use client";

import { ReactNode } from "react";

interface Props{

children:ReactNode;

}

export default function BentoGrid({

children

}:Props){

return(

<div className="grid gap-6 auto-rows-[170px] grid-cols-12">

{children}

</div>

);

}
