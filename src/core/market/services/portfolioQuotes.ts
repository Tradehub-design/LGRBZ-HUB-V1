import { quotes } from "../runtime/providerRuntime";

export async function portfolioQuotes(

tickers:string[]

){

return quotes(

[...new Set(tickers)]

);

}
