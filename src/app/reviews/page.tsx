import ReviewCalendar from "@/components/reviews/ReviewCalendar";
import DailyReviewPanel from "@/components/reviews/DailyReviewPanel";
import PortfolioTimeline from "@/components/reviews/PortfolioTimeline";

export default function ReviewsPage(){

return(

<div className="mx-auto max-w-[1900px] px-10 py-8 space-y-6">

<div className="grid gapx-10 py-8 xl:grid-cols-12">

<div className="xl:col-span-8">

<ReviewCalendar/>

</div>

<div className="xl:col-span-4">

<DailyReviewPanel/>

</div>

</div>

<PortfolioTimeline/>

</div>

);

}
