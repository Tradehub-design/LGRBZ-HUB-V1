import type {

TaxLot

} from "./taxLots";

export function estimateCapitalGain(

lot:TaxLot,

sellPrice:number,

quantity:number

){

const cost=

lot.purchasePrice*

quantity;

const proceeds=

sellPrice*

quantity;

return{

cost,

proceeds,

gain:

proceeds-cost

};

}
