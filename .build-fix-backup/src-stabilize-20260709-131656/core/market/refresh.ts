import { refreshQuote } from "./prices";

export async function refreshPortfolio(

tickers:string[]

){

await Promise.all(

tickers.map(

ticker=>

refreshQuote(

ticker

)

)

);

}

