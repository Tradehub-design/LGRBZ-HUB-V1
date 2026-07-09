import type { AssetSnapshot } from "./types";

const assets=new Map<string,AssetSnapshot>();

export function getAsset(

ticker:string

){

return assets.get(ticker);

}

export function setAsset(

asset:AssetSnapshot

){

assets.set(

asset.ticker,

asset

);

}

export function getAssets(){

return [...assets.values()];

}

