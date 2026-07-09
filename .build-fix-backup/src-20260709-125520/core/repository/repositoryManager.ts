const repositories=

new Map<string,any>();

export function registerRepository(

name:string,

repository:any

){

repositories.set(

name,

repository

);

}

export function repository<T>(

name:string

):T{

const repo=

repositories.get(name);

if(!repo){

throw new Error(

`${name} repository missing`

);

}

return repo;

}
