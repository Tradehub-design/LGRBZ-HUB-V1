import {

parseCSV

} from "./csvParser";

import {

validateImport

} from "./validateImport";

export function importCSV(

text:string

){

const rows=

parseCSV(text);

return validateImport(

rows

);

}

