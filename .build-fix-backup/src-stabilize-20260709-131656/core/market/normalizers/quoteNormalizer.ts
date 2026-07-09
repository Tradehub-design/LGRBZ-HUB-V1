export function normalizeQuote(

quote:any

){

return{

ticker:quote.ticker,

price:Number(

quote.price||0

),

open:Number(

quote.open||0

),

high:Number(

quote.high||0

),

low:Number(

quote.low||0

),

volume:Number(

quote.volume||0

),

timestamp:

Date.now()

};

}

