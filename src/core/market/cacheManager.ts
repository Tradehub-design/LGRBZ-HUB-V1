type CacheEntry<T>={

value:T;

expires:number;

};

const cache=new Map<string,CacheEntry<any>>();

export function getCache<T>(key:string){

const item=cache.get(key);

if(!item)return null;

if(Date.now()>item.expires){

cache.delete(key);

return null;

}

return item.value as T;

}

export function setCache<T>(

key:string,

value:T,

ttl:number

){

cache.set(

key,

{

value,

expires:Date.now()+ttl

}

);

}

export function clearCache(){

cache.clear();

}
