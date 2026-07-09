import { AssetProfile } from "./types";

export async function resolveTicker(

ticker:string

):Promise<AssetProfile>{

return{

ticker,

company:"",

exchange:"",

country:"",

sector:"",

industry:"",

currency:"AUD",

assetClass:"Stock",

dividend:false,

franking:0,

risk:"Medium",

description:""

};

}

