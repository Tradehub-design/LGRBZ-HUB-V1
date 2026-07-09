"use client";

import { ReactNode } from "react";

interface Props{

children:ReactNode;

}

export default function LGRBZContainer({

children

}:Props){

return(

<div className="mx-auto w-full max-w-[1920px] px-8 py-6 2xl:px-12">

{children}

</div>

);

}
