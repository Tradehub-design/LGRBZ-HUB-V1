"use client";

import PageTransition from "./transitions/PageTransition";

import ResponsiveContainer from "@/components/dashboard/layout/ResponsiveContainer";

export default function Page({

children

}:{

children:React.ReactNode

}){

return(

<PageTransition>

<ResponsiveContainer>

{children}

</ResponsiveContainer>

</PageTransition>

);

}

