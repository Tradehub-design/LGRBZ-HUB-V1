export type HealthScore = {
  score: number;
  diversification: number;
  income: number;
  concentration: number;
  risk: number;
  liquidity: number;
  grade: "A+"|"A"|"B"|"C"|"D";
};

export function calculateHealthScore() : HealthScore {

return{

score:88,
diversification:91,
income:82,
concentration:84,
risk:90,
liquidity:95,
grade:"A"

}

}
