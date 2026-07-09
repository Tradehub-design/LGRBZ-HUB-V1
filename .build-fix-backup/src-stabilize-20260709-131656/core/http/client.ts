import { MARKET_CONFIG } from "@/config/market";

export async function httpGet<T>(

url:string,

init?:RequestInit

):Promise<T>{

const controller=new AbortController();

const timeout=setTimeout(

()=>controller.abort(),

MARKET_CONFIG.requestTimeout

);

try{

const response=await fetch(url,{

...init,

signal:controller.signal,

cache:"no-store"

});

if(!response.ok){

throw new Error(

`HTTP ${response.status}`

);

}

return await response.json();

}finally{

clearTimeout(timeout);

}

}

