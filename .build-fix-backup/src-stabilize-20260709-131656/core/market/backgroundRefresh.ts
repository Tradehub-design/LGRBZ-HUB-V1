import {

flushQueue

} from "./refreshQueue";

import {

getBatchQuotes

} from "./batchQuotes";

export async function backgroundRefresh(){

const tickers=

flushQueue();

if(

tickers.length===0

){

return;

}

await getBatchQuotes(

tickers

);

}

