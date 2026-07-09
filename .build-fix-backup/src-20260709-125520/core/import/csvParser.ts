import type {

ImportRow

} from "./types";

export function parseCSV(

text:string

):ImportRow[]{

const rows=

text

.split("\n")

.slice(1);

return rows.map(row=>{

const c=row.split(",");

return{

date:c[0],

ticker:c[1],

action:c[2],

quantity:Number(c[3]),

price:Number(c[4]),

fees:Number(c[5]),

currency:c[6],

broker:c[7],

notes:c[8]??""

};

});

}

