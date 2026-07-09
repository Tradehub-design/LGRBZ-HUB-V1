import type {

MarketQuote,

QuoteMap

} from "./types";

const cache:QuoteMap={};

export function saveQuote(

quote:MarketQuote

){

cache[quote.ticker]=quote;

}

export function getQuote(

ticker:string

){

return cache[ticker];

}

export function getAllQuotes(){

return cache;

}

