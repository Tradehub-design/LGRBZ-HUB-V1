import type { ImportRow } from "../types";

export function reconcileTransactions(

incoming:ImportRow[],

existing:ImportRow[]

){

const existingKeys=

new Set(

existing.map(e=>

`${e.date}|${e.ticker}|${e.action}|${e.quantity}|${e.price}`

)

);

return incoming.filter(i=>

!existingKeys.has(

`${i.date}|${i.ticker}|${i.action}|${i.quantity}|${i.price}`

)

);

}
