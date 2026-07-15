import { memo } from "react";

export function memoChart<T>(
    component: React.FC<T>
){
    return memo(component);
}

export default memoChart;
