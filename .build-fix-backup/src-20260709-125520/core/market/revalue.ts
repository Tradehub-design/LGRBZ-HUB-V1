import type { Holding } from "@/core/portfolio/types";

import {

getQuote

} from "./cache";

export function revalueHoldings(

holdings:Holding[]

){

return holdings.map(h=>{

const quote=

getQuote(h.ticker);

if(!quote){

return h;

}

return{

...h,

metrics:{

...h.metrics,

marketPrice:

quote.price,

marketValue:

quote.price*

h.quantity

}

};

});

}

