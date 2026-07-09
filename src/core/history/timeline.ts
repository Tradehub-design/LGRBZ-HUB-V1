export interface TimelineEvent{

id:string;

time:string;

title:string;

description:string;

}

const timeline:TimelineEvent[]=[];

export function addTimeline(

event:TimelineEvent

){

timeline.unshift(event);

}

export function getTimeline(){

return timeline;

}

