export interface ProviderHealth{

name:string;

online:boolean;

latency:number;

lastChecked:number;

failures:number;

}

const providers=new Map<string,ProviderHealth>();

export function updateProviderHealth(

health:ProviderHealth

){

providers.set(

health.name,

health

);

}

export function getProviderHealth(){

return [...providers.values()];

}

export function bestProvider(){

return [...providers.values()]

.filter(

p=>p.online

)

.sort(

(a,b)=>

a.latency-b.latency

)[0];

}

