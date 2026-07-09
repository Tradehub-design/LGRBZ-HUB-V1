export type MarketStatus=

"OPEN"|

"CLOSED"|

"PREMARKET"|

"AFTERHOURS";

export interface MarketSession{

market:string;

status:MarketStatus;

opens:string;

closes:string;

timezone:string;

}

export function getMarketSession(

market:string

):MarketSession{

switch(market){

case "ASX":

return{

market,

status:"OPEN",

opens:"10:00",

closes:"16:00",

timezone:"Australia/Sydney"

};

case "NASDAQ":

return{

market,

status:"OPEN",

opens:"09:30",

closes:"16:00",

timezone:"America/New_York"

};

default:

return{

market,

status:"CLOSED",

opens:"",

closes:"",

timezone:"UTC"

};

}

}

