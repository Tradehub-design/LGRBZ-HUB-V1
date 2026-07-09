import { getProvider } from "./providerManager";
import { getCache,setCache } from "./cacheManager";

export async function getCompanyProfile(

ticker:string

){

const cacheKey=

`profile:${ticker}`;

const cached=

getCache(cacheKey);

if(cached){

return cached;

}

const profile=

await getProvider()

.getProfile(

ticker

);

setCache(

cacheKey,

profile,

1000*60*60*24*30

);

return profile;

}

