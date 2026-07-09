import {

registerRepository

} from "./repositoryManager";

import {

transactionRepository

} from "./adapters/transactionRepository";

import {

holdingRepository

} from "./adapters/holdingRepository";

export function registerRepositories(){

registerRepository(

"transactions",

transactionRepository

);

registerRepository(

"holdings",

holdingRepository

);

}
