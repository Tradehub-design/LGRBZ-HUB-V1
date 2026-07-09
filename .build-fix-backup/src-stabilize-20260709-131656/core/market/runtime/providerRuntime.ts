import { getProvider } from "../providerManager";

export async function quote(

ticker:string

){

return getProvider()

.getQuote(

ticker

);

}

export async function quotes(

tickers:string[]

){

return getProvider()

.getQuotes(

tickers

);

}

export async function profile(

ticker:string

){

return getProvider()

.getProfile(

ticker

);

}

