export interface Repository<T>{

findAll():Promise<T[]>;

findById(id:string):Promise<T|null>;

create(item:T):Promise<void>;

update(item:T):Promise<void>;

delete(id:string):Promise<void>;

}

export interface Syncable{

id:string;

createdAt:string;

updatedAt:string;

version:number;

deletedAt?:string|null;

}
