import type { Holding } from "@/core/portfolio/types";

export function calculatePnL(

holdings:Holding[]

){

const cost=

holdings.reduce(

(s,h)=>

s+h.metrics.costBasis,

0

);

const value=

holdings.reduce(

(s,h)=>

s+h.metrics.marketValue,

0

);

return{

cost,

value,

profit:

value-cost,

percent:

cost===0

?0

:((value-cost)/cost)*100

};

}
