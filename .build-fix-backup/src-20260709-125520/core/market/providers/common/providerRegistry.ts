import type { MarketProvider } from "../provider";

const providers=

new Map<string,MarketProvider>();

export function register(

name:string,

provider:MarketProvider

){

providers.set(name,provider);

}

export function allProviders(){

return [...providers.keys()];

}

export function get(

name:string

){

return providers.get(name);

}

