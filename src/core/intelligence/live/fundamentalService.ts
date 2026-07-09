import { getAsset } from "@/core/datahub/cache";

export async function getFundamentals(

ticker:string

){

const asset=

getAsset(ticker);

if(!asset){

return null;

}

return{

ticker,

marketCap:

asset.profile?.marketCap??null,

enterpriseValue:

asset.profile?.enterpriseValue??null,

pe:

asset.profile?.pe??null,

forwardPE:

asset.profile?.forwardPE??null,

eps:

asset.profile?.eps??null,

beta:

asset.profile?.beta??null,

dividendYield:

asset.profile?.dividendYield??null,

week52High:

asset.quote?.yearHigh??null,

week52Low:

asset.quote?.yearLow??null,

averageVolume:

asset.quote?.avgVolume??null,

sharesOutstanding:

asset.profile?.sharesOutstanding??null,

priceToBook:

asset.profile?.priceToBook??null,

returnOnEquity:

asset.profile?.roe??null,

profitMargin:

asset.profile?.profitMargin??null,

lastUpdated:

new Date().toISOString()

};

}
