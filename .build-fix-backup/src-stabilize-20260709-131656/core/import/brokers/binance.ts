import { parseCSV } from "../csvParser";

export const BinanceImporter={

name:"Binance",

supports(file:string){

return file.toLowerCase().includes("binance");

},

async parse(contents:string){

return parseCSV(contents);

}

};
