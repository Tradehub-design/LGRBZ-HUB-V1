export interface BenchmarkResult{

portfolio:number;

benchmark:number;

outperformance:number;

}

export function compareBenchmark(

portfolio:number,

benchmark:number

):BenchmarkResult{

return{

portfolio,

benchmark,

outperformance:

portfolio-

benchmark

};

}
