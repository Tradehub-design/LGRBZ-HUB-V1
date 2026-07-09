export type InsightSeverity=

"info"|
"success"|
"warning"|
"critical";

export interface AIInsight{

id:string;

title:string;

summary:string;

details:string;

severity:InsightSeverity;

score:number;

category:
"Risk"|
"Income"|
"Growth"|
"Diversification"|
"Performance";

created:string;

}
