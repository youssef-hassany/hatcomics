"use client";

import { useCreateReview } from "@/hooks/reviews/useCreateReview";
import { Star, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ComponentProtector from "../common/ComponentProtector";

interface ComicReviewFormProps {
  comicId: string;
}

const ComicReviewForm = ({ comicId }: ComicReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [hasSpoilers, setHasSpoilers] = useState<boolean>(false);

  const { mutateAsync: createReview, isPending: isLoading } = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    try {
      const formData = {
        rating,
        description: review.trim() || undefined,
        spoiler: hasSpoilers,
        comicId,
      };

      await createReview(formData);

      setRating(0);
      setReview("");
      setHasSpoilers(false);

      toast.success("Review Added, You got 2 points!");
    } catch (error) {
      console.error(error);
      toast.error("Failed To Add Review");
    }
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <ComponentProtector>
      <div className="bg-zinc-900 shadow-xl border border-zinc-800 p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-zinc-100 mb-6">Rate & Review</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => handleStarClick(starValue)}
                  onMouseEnter={() => handleStarHover(starValue)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded"
                  disabled={isLoading}
                >
                  <Star
                    className={`w-8 h-8 transition-colors duration-150 ${
                      starValue <= displayRating
                        ? "text-orange-400 fill-current"
                        : "text-zinc-600 hover:text-zinc-500"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm text-zinc-400">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Review Textarea */}
          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-zinc-300 mb-3"
            >
              Write a Review (Optional)
            </label>
            <textarea
              id="review"
              rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this comic..."
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical min-h-[120px]"
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-zinc-500">
              {review.length}/500 characters
            </div>
          </div>

          {/* Spoiler Checkbox - Only show if user has written something */}
          {review.trim() && (
            <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="spoilers"
                  checked={hasSpoilers}
                  onChange={(e) => setHasSpoilers(e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-zinc-700 border-zinc-600 rounded focus:ring-orange-500 focus:ring-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="spoilers"
                  className="flex items-center gap-2 text-sm font-medium text-zinc-300 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  This review contains spoilers
                </label>
                <p className="text-xs text-zinc-500 mt-1">
                  Check this box if your review reveals plot details or
                  surprises
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-500">* Rating is required</div>
            <Button
              type="submit"
              disabled={rating === 0 || isLoading}
              isLoading={isLoading}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </ComponentProtector>
  );
};

export default ComicReviewForm;
