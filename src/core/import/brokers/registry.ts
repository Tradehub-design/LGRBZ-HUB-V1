import type { BrokerImporter } from "./provider";

const registry:BrokerImporter[]=[];

export function registerImporter(

importer:BrokerImporter

){

registry.push(importer);

}

export function getImporter(

file:string

){

return registry.find(

i=>i.supports(file)

);

}

export function allImporters(){

return registry;

}
