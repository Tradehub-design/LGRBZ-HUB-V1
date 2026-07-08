import type {DividendRecord} from "./types"

export function calculateFranking(dividends:DividendRecord[]){

let cash=0
let frankingCredits=0

for(const d of dividends){

cash+=d.amountAud

const percent=d.frankingPercent??0

frankingCredits+=
(d.amountAud/(1-0.30))*0.30*(percent/100)

}

return{

cashDividendAud:cash,
frankingCreditsAud:frankingCredits,
grossedUpIncomeAud:cash+frankingCredits

}

}
