import type {

ImportRow,

ImportResult

} from "./types";

export function validateImport(

rows:ImportRow[]

):ImportResult{

const errors:string[]=[];

let success=0;

let failed=0;

rows.forEach((row,index)=>{

if(!row.ticker){

failed++;

errors.push(

`Row ${index+1}: Missing ticker`

);

return;

}

success++;

});

return{

success,

failed,

errors,

rows

};

}

