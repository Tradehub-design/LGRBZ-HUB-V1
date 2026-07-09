"use client";

import { ReactNode } from "react";

export default function ResponsiveContainer({

children

}:{

children:ReactNode

}){

return(

<div className="mx-auto w-full max-w-[1900px]">

{children}

</div>

);

}
