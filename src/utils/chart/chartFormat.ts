export function formatPercent(
    value:number|null
){

    if(value===null){
        return "—";
    }

    return `${value>0?"+":""}${value.toFixed(2)}%`;

}

export function formatCurrency(

value:number,

currency="AUD"

){

return new Intl.NumberFormat(

"en-AU",

{

style:"currency",

currency,

maximumFractionDigits:0

}

).format(value);

}

export function formatCompact(

value:number

){

return new Intl.NumberFormat(

"en-AU",

{

notation:"compact",

maximumFractionDigits:1

}

).format(value);

}
