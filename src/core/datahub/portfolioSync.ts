import { synchroniseTicker } from "./synchronise";

export async function syncPortfolio(

tickers:string[]

){

await Promise.all(

[...new Set(tickers)]

.map(

ticker=>

synchroniseTicker(

ticker

)

)

);

}

