import type { FifoDisposal } from "./fifo";

export type DiscountSummary = {
  eligibleGainAud:number
  nonEligibleGainAud:number
  discountAud:number
  taxableGainAud:number
}

function round(v:number){
return Math.round(v*100)/100
}

export function calculateDiscountSummary(
disposals:FifoDisposal[]
):DiscountSummary{

let eligible=0
let nonEligible=0

for(const d of disposals){

if(d.realisedGainAud<=0) continue

const buy=new Date(d.purchaseDate)
const sell=new Date(d.disposalDate)

const heldDays=(sell.getTime()-buy.getTime())/86400000

if(heldDays>=365){
eligible+=d.realisedGainAud
}else{
nonEligible+=d.realisedGainAud
}

}

const discount=eligible*0.5

return{

eligibleGainAud:round(eligible),
nonEligibleGainAud:round(nonEligible),
discountAud:round(discount),
taxableGainAud:round(nonEligible+(eligible-discount))

}

}
