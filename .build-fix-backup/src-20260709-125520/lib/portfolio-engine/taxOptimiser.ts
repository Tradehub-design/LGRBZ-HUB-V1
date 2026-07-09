export function buildTaxSuggestions(params:{
capitalGain:number
capitalLoss:number
discount:number
}){

const tips=[]

if(params.capitalGain>0&&params.capitalLoss===0){

tips.push({
title:"Harvest losses",
detail:"Realising losses may offset taxable gains."
})

}

if(params.discount===0){

tips.push({
title:"Hold positions longer",
detail:"Assets held over 12 months may qualify for CGT discount."
})

}

if(params.capitalGain<500){

tips.push({
title:"Low taxable gain",
detail:"Current realised gains are relatively small."
})

}

return tips

}
