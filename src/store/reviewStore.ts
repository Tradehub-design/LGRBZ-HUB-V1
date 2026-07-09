import { create } from "zustand";
import type { DailyReview } from "@/core/reviews/types";

interface ReviewState{

reviews:DailyReview[];

selectedDate:string|null;

select:(date:string)=>void;

save:(review:DailyReview)=>void;

}

export const useReviewStore=create<ReviewState>((set,get)=>({

reviews:[],

selectedDate:null,

select:(date)=>set({selectedDate:date}),

save:(review)=>{

const reviews=get().reviews.filter(r=>r.date!==review.date);

set({reviews:[...reviews,review]});

}

}));

