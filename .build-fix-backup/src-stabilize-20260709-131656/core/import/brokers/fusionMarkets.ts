import { parseCSV } from "../csvParser";

export const FusionMarketsImporter={

name:"Fusion Markets",

supports(file:string){

return file.toLowerCase().includes("fusion");

},

async parse(contents:string){

return parseCSV(contents);

}

};
