import {

MarketQuote

} from "./types";

import {

saveQuote

} from "./cache";

export async function refreshQuote(

ticker:string

):Promise<MarketQuote>{

const quote={

ticker,

price:0,

change:0,

changePercent:0,

open:0,

high:0,

low:0,

close:0,

volume:0,

marketCap:0,

updatedAt:new Date()

.toISOString()

};

saveQuote(

quote

);

return quote;

}

