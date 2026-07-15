"use client";

import { useMemo } from "react";

export function useChartMemo<T>(

factory:()=>T,

deps:any[]

){

return useMemo(factory,deps);

}
