import type { MarketProvider } from "./providers/provider";

let provider:MarketProvider|null=null;

export function registerProvider(

p:MarketProvider

){

provider=p;

}

export function getProvider(){

if(!provider){

throw new Error(

"No market provider registered."

);

}

return provider;

}
