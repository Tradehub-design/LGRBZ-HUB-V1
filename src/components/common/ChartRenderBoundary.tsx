"use client";

import { ReactNode } from "react";

type Props={

children:ReactNode;

};

export default function ChartRenderBoundary({

children

}:Props){

return(

<div

className="w-full overflow-hidden"

>

{children}

</div>

);

}
