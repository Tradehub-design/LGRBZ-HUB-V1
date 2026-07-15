"use client";

import { useEffect, useState } from "react";

type Props={
children:React.ReactNode;
delay?:number;
};

export default function DeferredChart({

children,

delay=100

}:Props){

const[visible,setVisible]=useState(false);

useEffect(()=>{

const timer=setTimeout(()=>{

setVisible(true);

},delay);

return()=>clearTimeout(timer);

},[delay]);

if(!visible){

return null;

}

return<>{children}</>;

}
