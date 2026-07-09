import {

quotes

} from "../gateway/marketGateway";

export async function refreshWatchlist(

tickers:string[]

){

return quotes(

tickers

);

}

