export function calculateTimeWeightedReturn(

periods:{

start:number;

end:number;

cashflow:number;

}[]

){

let total=1;

for(const p of periods){

if(p.start===0){

continue;

}

total*=

1+

(

(p.end-p.cashflow-p.start)

/p.start

);

}

return(

total-1

)*100;

}
