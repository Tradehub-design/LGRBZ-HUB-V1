"use client";

import {
useEffect,
useState
} from "react";

export default function useAnimatedNumber(

target:number,

duration=500

){

const[value,setValue]=useState(0);

useEffect(()=>{

let frame:number;

let start:number;

const animate=(time:number)=>{

if(!start){

start=time;

}

const progress=Math.min(

(time-start)/duration,

1

);

setValue(

target*progress

);

if(progress<1){

frame=requestAnimationFrame(animate);

}

};

frame=requestAnimationFrame(animate);

return()=>cancelAnimationFrame(frame);

},[target,duration]);

return value;

}
