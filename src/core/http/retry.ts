import { MARKET_CONFIG } from "@/config/market";

export async function retry<T>(

fn:()=>Promise<T>

):Promise<T>{

let error:unknown;

for(

let i=0;

i<MARKET_CONFIG.retryAttempts;

i++

){

try{

return await fn();

}catch(e){

error=e;

await new Promise(r=>

setTimeout(

r,

MARKET_CONFIG.retryDelay*(i+1)

)

);

}

}

throw error;

}

