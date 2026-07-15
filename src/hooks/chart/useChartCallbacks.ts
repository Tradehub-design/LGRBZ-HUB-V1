"use client";

import { useCallback } from "react";

export function useChartCallback<T extends(...args:any)=>any>(

fn:T

){

return useCallback(fn,[fn]);

}
