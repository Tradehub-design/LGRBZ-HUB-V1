import type { BrokerImporter } from "./provider";
import { parseCSV } from "../csvParser";

export const StakeImporter={

name:"Stake",

supports(file:string){

return file.toLowerCase().includes("stake");

},

async parse(contents:string){

return parseCSV(contents);

}

};
