"use client";

import { useEffect } from "react";

import {

registerRepositories

} from "@/core/repository/registerRepositories";

export default function useEnterprisePlatform(){

useEffect(()=>{

registerRepositories();

},[]);

}
