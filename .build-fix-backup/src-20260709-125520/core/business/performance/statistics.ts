import type {

Holding

} from "@/core/portfolio/types";

export function buildStatistics(

holdings:Holding[]

){

const total=

holdings.reduce(

(a,b)=>

a+b.metrics.marketValue,

0

);

const largest=

Math.max(

0,

...holdings.map(

h=>

h.metrics.marketValue

)

);

return{

holdings:

holdings.length,

largestHolding:

largest,

averageHolding:

holdings.length===0

?0

:total/

holdings.length,

concentration:

total===0

?0

:(largest/total)*100

};

}
