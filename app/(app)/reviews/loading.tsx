import ComicReviewSkeleton from "@/components/reviews/ComicReviewSkeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Latest Reviews</h1>
          <p className="text-zinc-400">
            Take a Look at Our Users Comic Reviews
          </p>
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((el) => (
            <ComicReviewSkeleton key={el} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
