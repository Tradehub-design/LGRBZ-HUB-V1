import { portfolioQuotes } from "./portfolioQuotes";

export async function refreshPortfolio(

tickers:string[]

){

return portfolioQuotes(

tickers

);

}
