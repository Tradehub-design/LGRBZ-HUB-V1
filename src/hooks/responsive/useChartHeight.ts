"use client";

import { useEffect,useState } from "react";

export default function useChartHeight(){

const[height,setHeight]=useState(460);

useEffect(()=>{

function update(){

const width=window.innerWidth;

if(width<640){

setHeight(300);

return;

}

if(width<1024){

setHeight(380);

return;

}

setHeight(460);

}

update();

window.addEventListener("resize",update);

return()=>window.removeEventListener("resize",update);

},[]);

return height;

}
