import { useFxStore } from "../fx/store";

export function convert(

amount:number,

base:string,

quote:string

){

if(base===quote){

return amount;

}

const pair=

`${base}_${quote}`;

const rate=

useFxStore

.getState()

.find(pair);

if(!rate){

return amount;

}

return amount*rate.rate;

}
