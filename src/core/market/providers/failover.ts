import { getProviderHealth } from "./providerHealth";

export function chooseProvider(){

const providers=

getProviderHealth()

.filter(

p=>p.online

);

providers.sort(

(a,b)=>

a.latency-b.latency

);

return providers[0];

}

