"use client";

import { useReviewStore } from "@/store/reviewStore";

export default function DailyReviewPanel() {
  const { selectedDate, reviews } = useReviewStore();
  const review = reviews.find(r => r.date === selectedDate);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 font-semibold">Daily Review</h2>

      {review ? (
        <>
          <h3 className="font-bold">{review.title}</h3>
          <p className="mt-3">{review.summary}</p>
        </>
      ) : (
        <div className="text-muted-foreground">No review for this date.</div>
      )}
    </div>
  );
}
