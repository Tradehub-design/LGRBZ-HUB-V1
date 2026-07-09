import {

refreshInterval

} from "./refreshInterval";

export function scheduler(

exchange:string,

callback:()=>void

){

const interval=

refreshInterval(exchange);

callback();

return setInterval(

callback,

interval

);

}

