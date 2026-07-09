import {

getImporter

} from "../brokers/registry";

export async function runImport(

fileName:string,

contents:string

){

const importer=

getImporter(fileName);

if(!importer){

throw new Error(

"No importer available."

);

}

return importer.parse(

contents

);

}
