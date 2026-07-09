import type { BrokerImporter } from "./provider";
import { parseCSV } from "../csvParser";

export const CommSecImporter:BrokerImporter={

name:"CommSec",

supports(file){

return file.toLowerCase().includes("commsec");

},

async parse(contents){

return parseCSV(contents);

}

};
