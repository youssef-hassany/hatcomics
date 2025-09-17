import { ComicPreview } from "@/types/Comic";
import { Book, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  comic: ComicPreview;
}

const ComicCard = ({ comic }: Props) => {
  const renderStars = (rating: number | null) => {
    if (rating === null)
      return <span className="text-zinc-400">No ratings</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-zinc-400" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-zinc-300 text-sm ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-zinc-700">
      {/* Comic Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-700">
        <img
          src={comic.image}
          alt={comic.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <div className="hidden absolute inset-0 flex items-center justify-center bg-zinc-700">
          <Book className="w-12 h-12 text-zinc-500" />
        </div>

        {/* Beginner Friendly Badge */}
        {comic.isBeginnerFriendly && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            Beginner <span className="hidden md:inline">Friendly</span>
          </div>
        )}

        {/* Rating Badge */}
        {comic.averageRating && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            {comic.averageRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Comic Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight">
          {comic.name}
        </h3>

        {/* Publisher */}
        {comic.publisher && (
          <p className="text-orange-600 font-medium text-sm mb-2">
            {comic.publisher}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {/* Number of Issues */}
          {!comic.ongoing && !comic.isGraphicNovel && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <span>📚 {comic.numberOfIssues} issues</span>
            </div>
          )}

          {comic.ongoing && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <span>📚 Ongoing</span>
            </div>
          )}

          {comic.isGraphicNovel && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <span>📚 Graphic Novel</span>
            </div>
          )}

          {/* Reviews */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span>💬 {comic.totalReviews} reviews</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            {renderStars(comic.averageRating)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* View Details Button */}
          <Link
            href={`/comics/${comic.id}`}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
          >
            <span>View Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComicCard;
