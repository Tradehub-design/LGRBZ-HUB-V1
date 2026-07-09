export interface DividendEvent{

ticker:string;

exDate:string;

paymentDate:string;

amount:number;

yield:number;

}

export function upcomingDividends(

events:DividendEvent[]

){

return events.sort(

(a,b)=>

a.exDate.localeCompare(

b.exDate

)

);

}
