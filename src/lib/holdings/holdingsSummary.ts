export interface HoldingSummary {
  totalValue:number;
  totalCost:number;
  totalGain:number;
  totalGainPercent:number;
  holdings:number;
}

export function buildHoldingSummary(rows:any[]):HoldingSummary{

    const totalValue=rows.reduce(
        (a,b)=>a+(b.marketValue||0),0
    );

    const totalCost=rows.reduce(
        (a,b)=>a+(b.costBase||0),0
    );

    const totalGain=totalValue-totalCost;

    return{
        totalValue,
        totalCost,
        totalGain,
        totalGainPercent:
            totalCost===0
                ?0
                :(totalGain/totalCost)*100,
        holdings:rows.length
    };
}
