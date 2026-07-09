import { getProvider } from "../providerManager";

export async function quote(
ticker:string
){
return getProvider().getQuote(ticker);
}

export async function quotes(
tickers:string[]
){
return getProvider().getQuotes(tickers);
}

export async function profile(
ticker:string
){
return getProvider().getProfile(ticker);
}

export async function snapshot(
ticker:string
){
const provider=getProvider();

const [
quote,
profile
]=await Promise.all([
provider.getQuote(ticker),
provider.getProfile(ticker)
]);

return{
quote,
profile
};
}
