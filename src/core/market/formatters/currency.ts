export function currency(

value:number,

currency="AUD"

){

return new Intl.NumberFormat(

undefined,

{

style:"currency",

currency,

maximumFractionDigits:2

}

).format(value);

}

