import type { ImportRow } from "../types";

export interface BrokerImporter{

name:string;

supports(fileName:string):boolean;

parse(contents:string):Promise<ImportRow[]>;

}
