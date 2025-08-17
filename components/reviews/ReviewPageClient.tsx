"use client";

import ComicReview from "@/components/reviews/ComicReview";
import ComicReviewSkeleton from "@/components/reviews/ComicReviewSkeleton";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { Review } from "@/types/Review";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReviewPageClientProps {
  initialReview?: Review;
}

const ReviewPageClient = ({ initialReview }: ReviewPageClientProps) => {
  const router = useRouter();
  const { data: loggedInUser, isLoading: userLoading } = useGetLoggedInUser();

  if (!initialReview) {
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

          {/* Error State */}
          <div className="text-center py-12">
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-8">
              <h2 className="text-xl font-semibold text-white mb-2">
                Review Not Found
              </h2>
              <p className="text-zinc-400 mb-6">
                The review you are looking for does not exist or has been
                removed.
              </p>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Reviews
            </Link>
          </div>
          <ComicReviewSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reviews
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            {initialReview.comic.name} Review
          </h1>
          <p className="text-zinc-400">
            Full review by {initialReview.user.fullname}
          </p>
        </div>

        {/* Review Component */}
        <ComicReview
          id={initialReview.id}
          rating={initialReview.rating}
          user={initialReview.user}
          content={initialReview.description}
          comic={initialReview.comic}
          hasSpoilers={initialReview.spoiler}
          updatedAt={initialReview.updatedAt}
          createdAt={initialReview.createdAt}
          isOwner={loggedInUser?.id === initialReview.user.id}
          showFullContent={true}
          onDeleteSuccess={() => router.push("/reviews")}
        />
      </div>
    </div>
  );
};

export default ReviewPageClient;
