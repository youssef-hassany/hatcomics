"use client";

import ComicReviewSkeleton from "@/components/reviews/ComicReviewSkeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ReviewPageLoading = () => {
  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reviews
          </Link>
        </div>

        {/* Loading Skeleton */}
        <ComicReviewSkeleton />
      </div>
    </div>
  );
};

export default ReviewPageLoading;
