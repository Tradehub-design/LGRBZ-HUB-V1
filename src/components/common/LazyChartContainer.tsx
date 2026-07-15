"use client";

import dynamic from "next/dynamic";

export const LazyPositionChart=dynamic(

()=>import("./ChartRenderBoundary"),

{

ssr:false

}

);
