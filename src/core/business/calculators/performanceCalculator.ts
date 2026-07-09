export function calculatePerformance(

cost:number,

market:number,

realised:number,

dividends:number

){

const total=

market+

realised+

dividends;

return{

profit:

total-cost,

percent:

cost===0

?0

:((total-cost)/cost)*100

};

}

