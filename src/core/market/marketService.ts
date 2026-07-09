import { getProvider } from "./providerManager";
import { getCache,setCache } from "./cacheManager";

export async function getQuote(

ticker:string

){

const key=`quote:${ticker}`;

const cached=getCache(key);

if(cached){

return cached;

}

const quote=

await getProvider()

.getQuote(ticker);

setCache(

key,

quote,

30000

);

return quote;

}
