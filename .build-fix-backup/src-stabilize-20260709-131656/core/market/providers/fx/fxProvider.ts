import { httpGet } from "@/core/http/client";

export async function fxRates(

base:string

){

return httpGet<any>(

`https://open.er-api.com/v6/latest/${base}`

);

}
