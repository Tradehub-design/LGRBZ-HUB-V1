export interface EarningsEvent{

ticker:string;

date:string;

estimatedEPS:number|null;

actualEPS:number|null;

status:

"Upcoming"|

"Released";

}

export function upcomingEarnings(

events:EarningsEvent[]

){

return events

.filter(

e=>e.status==="Upcoming"

)

.sort(

(a,b)=>

a.date.localeCompare(

b.date

)

);

}
