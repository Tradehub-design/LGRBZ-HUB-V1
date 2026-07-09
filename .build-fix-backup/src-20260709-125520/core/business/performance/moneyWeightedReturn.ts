export interface CashFlow{

date:Date;

amount:number;

}

export function calculateMoneyWeightedReturn(

flows:CashFlow[],

guess=0.1

){

let rate=guess;

for(let i=0;i<100;i++){

let npv=0;

let derivative=0;

const start=flows[0].date.getTime();

for(const flow of flows){

const years=

(flow.date.getTime()-start)/31557600000;

npv+=

flow.amount/

Math.pow(

1+rate,

years

);

derivative+=

(-years*flow.amount)/

Math.pow(

1+rate,

years+1

);

}

const newRate=

rate-

npv/

derivative;

if(

Math.abs(

newRate-rate

)<1e-8

){

break;

}

rate=newRate;

}

return rate*100;

}
