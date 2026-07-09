import type { ImportRow } from "../types";

export function detectDuplicates(

rows:ImportRow[]

){

const seen=new Set<string>();

return rows.filter(row=>{

const key=[

row.date,

row.ticker,

row.action,

row.quantity,

row.price

].join("|");

if(seen.has(key)){

return true;

}

seen.add(key);

return false;

});

}
