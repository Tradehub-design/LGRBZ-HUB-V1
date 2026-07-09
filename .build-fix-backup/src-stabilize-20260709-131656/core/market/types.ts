export interface MarketQuote{

ticker:string;

price:number;

change:number;

changePercent:number;

open:number;

high:number;

low:number;

close:number;

volume:number;

marketCap:number;

updatedAt:string;

}

export interface QuoteMap{

[ticker:string]:MarketQuote;

}

