"use client";

import {
useEffect,
useState
} from "react";

export default function useReducedMotionPreference(){

const[prefersReducedMotion,

setPreference]=useState(false);

useEffect(()=>{

const media=

window.matchMedia(

"(prefers-reduced-motion: reduce)"

);

setPreference(media.matches);

const listener=()=>{

setPreference(media.matches);

};

media.addEventListener(

"change",

listener

);

return()=>{

media.removeEventListener(

"change",

listener

);

};

},[]);

return prefersReducedMotion;

}
