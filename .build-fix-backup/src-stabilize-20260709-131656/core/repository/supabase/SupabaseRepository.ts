import { supabase } from "@/lib/supabase";
import type { Repository } from "../types";

export class SupabaseRepository<T extends {id:string}>
implements Repository<T>{

constructor(

private table:string

){}

async findAll(){

const { data,error }=

await supabase

.from(this.table)

.select("*");

if(error){

throw error;

}

return data as T[];

}

async findById(

id:string

){

const { data,error }=

await supabase

.from(this.table)

.select("*")

.eq("id",id)

.single();

if(error){

return null;

}

return data as T;

}

async create(

item:T

){

const { error }=

await supabase

.from(this.table)

.insert(item);

if(error){

throw error;

}

}

async update(

item:T

){

const { error }=

await supabase

.from(this.table)

.update(item)

.eq("id",item.id);

if(error){

throw error;

}

}

async delete(

id:string

){

const { error }=

await supabase

.from(this.table)

.delete()

.eq("id",id);

if(error){

throw error;

}

}

}
