import type { Holding } from "@/core/portfolio/types";

export function calculateLivePortfolio(

holdings:Holding[],

cash:number

){

const holdingsValue=

holdings.reduce(

(sum,h)=>

sum+h.metrics.marketValue,

0

);

return{

holdings:holdingsValue,

cash,

total:

holdingsValue+cash

};

}
