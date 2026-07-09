import { getQuote } from "@/core/market/marketService";
import { getCompanyProfile } from "@/core/market/companyProfile";
import { setAsset } from "./cache";

export async function synchroniseTicker(

ticker:string

){

const [

quote,

profile

]=await Promise.all([

getQuote(ticker),

getCompanyProfile(ticker)

]);

setAsset({

ticker,

quote,

profile,

dividend:null,

earnings:null,

news:[],

updated:Date.now()

});

}

