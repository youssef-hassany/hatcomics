import { ComicPreview } from "@/types/Comic";
import { Book, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  comic: ComicPreview;
  onSelect?: (comic: ComicPreview) => void;
}

const ComicCard = ({ comic, onSelect }: Props) => {
  const renderStars = (rating: number | null) => {
    if (rating === null) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-2.5 h-2.5 text-zinc-500" />
      );
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <Link
      href={onSelect ? "#" : `/comics/${comic.id}`}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(comic);
        }
      }}
      className="group block bg-zinc-800/50 rounded-lg overflow-hidden hover:bg-zinc-800 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
    >
      {/* Comic Cover */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <img
          src={comic.image}
          alt={comic.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <div className="hidden absolute inset-0 flex items-center justify-center bg-zinc-900">
          <Book className="w-8 h-8 text-zinc-700" />
        </div>

        {/* Badges - Always Visible */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1">
          {/* Beginner Friendly Badge */}
          {comic.isBeginnerFriendly && (
            <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md">
              Beginner
            </div>
          )}

          {/* Rating Badge */}
          {comic.averageRating && (
            <div className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-0.5 ml-auto">
              <Star className="w-2.5 h-2.5 fill-white" />
              {comic.averageRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      {/* Comic Details - Compact but Complete */}
      <div className="p-2">
        {/* Comic Title */}
        <h3 className="font-bold text-sm text-white line-clamp-2 leading-tight mb-1 group-hover:text-orange-400 transition-colors">
          {comic.name}
        </h3>

        {/* Publisher */}
        {comic.publisher && (
          <p className="text-orange-500 text-xs font-medium mb-2 truncate">
            {comic.publisher}
          </p>
        )}

        {/* Metadata - Always Visible */}
        <div className="space-y-1">
          {/* Issue Count / Type */}
          <div className="flex items-center text-zinc-400 text-[10px]">
            {!comic.ongoing && !comic.isGraphicNovel && (
              <span>📚 {comic.numberOfIssues} issues</span>
            )}
            {comic.ongoing && <span>📚 Ongoing</span>}
            {comic.isGraphicNovel && <span>📚 Graphic Novel</span>}
          </div>

          {/* Reviews */}
          <div className="flex items-center text-zinc-400 text-[10px]">
            <span>💬 {comic.totalReviews} reviews</span>
          </div>

          {/* Star Rating */}
          {comic.averageRating ? (
            <div className="flex items-center gap-1">
              {renderStars(comic.averageRating)}
              <span className="text-zinc-400 text-[10px] ml-0.5">
                ({comic.averageRating.toFixed(1)})
              </span>
            </div>
          ) : (
            <div className="text-zinc-500 text-[10px]">No ratings yet</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ComicCard;
