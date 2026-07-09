import { EXCHANGE_SESSIONS } from "./exchangeSchedule";

export function marketOpen(

exchange:string

){

const session=

EXCHANGE_SESSIONS[exchange as keyof typeof EXCHANGE_SESSIONS];

if(!session){

return true;

}

const now=

new Date();

const hour=

now.getHours();

if(

!session.weekends&&

(now.getDay()==0||

now.getDay()==6)

){

return false;

}

return(

hour>=session.openHour&&

hour<session.closeHour

);

}

