import {

getProvider

} from "./providerManager";

export async function getBatchQuotes(

tickers:string[]

){

return getProvider()

.getQuotes(

[...new Set(tickers)]

);

}

