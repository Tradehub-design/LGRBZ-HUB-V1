import { marketOpen } from "./marketSession";

export function refreshInterval(

exchange:string

){

return marketOpen(exchange)

?30000

:900000;

}

