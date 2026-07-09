import { snapshot } from "../gateway/marketGateway";

import { dividendSnapshot }

from "../providers/dividends/dividendProvider";

import { earningsSnapshot }

from "../providers/earnings/earningsProvider";

import { companyNews }

from "../providers/news/newsProvider";

export async function fullSnapshot(

ticker:string

){

const [

market,

dividend,

earnings,

news

]=await Promise.all([

snapshot(ticker),

dividendSnapshot(ticker),

earningsSnapshot(ticker),

companyNews(ticker)

]);

return{

market,

dividend,

earnings,

news

};

}
