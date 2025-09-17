"use client";

import { Star, Eye, EyeOff, Calendar, Book } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReviewActions from "./ReviewActions";
import Avatar from "../ui/avatar";
import ShareButton from "./ShareButton";
import { starGenerator } from "@/lib/utils";

interface ReviewUser {
  id: string;
  username: string;
  fullname: string;
  photo?: string;
}

interface Comic {
  id: string;
  name: string;
  numberOfIssues: number;
  image?: string;
  isGraphicNovel: boolean;
}

interface ComicReviewProps {
  id: string;
  user: ReviewUser;
  comic: Comic;
  rating: number;
  content?: string;
  hasSpoilers?: boolean;
  createdAt: string;
  updatedAt?: string;
  isOwner?: boolean;
  onDeleteSuccess?: () => void;
  showFullContent?: boolean; // New prop to control content display
}

const ComicReview = ({
  id,
  user,
  comic,
  rating,
  content,
  hasSpoilers = false,
  createdAt,
  isOwner = false,
  onDeleteSuccess,
  showFullContent = false, // Default to false for list view
}: ComicReviewProps) => {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const toggleSpoilers = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSpoilers(!showSpoilers);
  };

  const toggleExpanded = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    // Only navigate if not showing full content (i.e., in list view)
    if (!showFullContent) {
      router.push(`/reviews/${id}`);
    }
  };

  // Determine content display based on context
  const getDisplayContent = () => {
    if (!content) return "";

    if (showFullContent) {
      // Full content view - show everything with expand/collapse for very long content
      const isVeryLongContent = content.length > 800;
      return isVeryLongContent && !isExpanded
        ? `${content.slice(0, 800)}...`
        : content;
    } else {
      // List view - show only first 100 characters
      return content.length > 100 ? `${content.slice(0, 100)}...` : content;
    }
  };

  const displayContent = getDisplayContent();
  const isVeryLongContent = showFullContent && content && content.length > 800;
  const shouldShowExpandButton = showFullContent && isVeryLongContent;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const renderStars = (rating: number | null) => {
    if (rating === null)
      return <span className="text-zinc-400">No ratings</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 fill-current`}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-orange-400 text-orange-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-zinc-400" />);
    }

    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div
      className={`bg-zinc-800 rounded-xl border border-zinc-700 p-4 sm:p-6 transition-all duration-200 hover:border-zinc-600 ${
        !showFullContent ? "cursor-pointer hover:bg-zinc-750" : ""
      }`}
      onClick={handleReviewClick}
    >
      {/* Comic Info Section - Clickable */}
      <Link href={`/comics/${comic.id}`} className="block">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-700 hover:bg-zinc-750 transition-colors duration-200 rounded-lg p-2 -m-2">
          <div className="flex-shrink-0">
            {comic.image ? (
              <img
                src={comic.image}
                alt={comic.name}
                className="w-10 h-12 sm:w-12 sm:h-16 rounded border border-zinc-700 object-cover"
              />
            ) : (
              <div className="w-10 h-12 sm:w-12 sm:h-16 rounded border border-zinc-700 bg-zinc-700 flex items-center justify-center">
                <Book className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-100 truncate text-base sm:text-lg">
              {comic.name}
            </h3>
            {comic.numberOfIssues && (
              <p className="text-zinc-400 text-xs sm:text-sm">
                Issues:{" "}
                {comic.isGraphicNovel ? "Graphic Novel" : comic.numberOfIssues}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              url={user.photo || "/placeholder-avatar.png"}
              username={user.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-zinc-700"
            />
          </div>

          {/* User Info & Rating */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-1">
              <h4 className="font-semibold text-zinc-100 truncate text-sm sm:text-base">
                {user.fullname}
              </h4>

              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Calendar className="w-3 h-3" />
                <time dateTime={new Date(createdAt).toISOString()}>
                  {formatDate(new Date(createdAt))}
                </time>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(rating)}
              </div>
              <span className="text-xs sm:text-sm text-zinc-400">
                {rating}/5
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <ShareButton
            url={
              typeof window !== "undefined"
                ? `${window.location.origin}/reviews/${id}`
                : ""
            }
            title={`${user.fullname}'s review of ${comic.name}`}
            text={`Check out this ${starGenerator(rating)} review of ${
              comic.name
            } by ${user.fullname}!`}
          />
          <ReviewActions
            reviewId={id}
            isOwner={isOwner}
            onSuccess={onDeleteSuccess}
          />
        </div>
      </div>

      {/* Review Content */}
      {content && (
        <div className="mb-4">
          {/* Spoiler Warning */}
          {hasSpoilers && !showSpoilers && (
            <div className="mb-4 p-3 sm:p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-300">
                  This review contains spoilers
                </span>
              </div>
              <button
                onClick={toggleSpoilers}
                className="text-xs text-yellow-400 hover:text-yellow-300 underline"
              >
                Click to reveal spoilers
              </button>
            </div>
          )}

          {/* Review Text */}
          {(!hasSpoilers || showSpoilers) && (
            <div className="relative">
              {hasSpoilers && showSpoilers && (
                <div className="flex items-center gap-2 mb-3">
                  <EyeOff className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-400">
                    Spoiler content below
                  </span>
                  <button
                    onClick={toggleSpoilers}
                    className="text-xs text-yellow-400 hover:text-yellow-300 underline ml-auto"
                  >
                    Hide spoilers
                  </button>
                </div>
              )}

              <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none prose-zinc rich-text-editor">
                <p className="whitespace-pre-wrap text-white text-sm sm:text-base">
                  {displayContent}
                </p>
              </div>

              {/* Expand/Collapse for very long content in full view */}
              {shouldShowExpandButton && (
                <button
                  onClick={toggleExpanded}
                  className="mt-2 text-sm text-orange-400 hover:text-orange-300 font-medium"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}

              {/* Read More button for list view */}
              {!showFullContent && content.length > 100 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/reviews/${id}`);
                  }}
                  className="mt-2 text-sm text-orange-400 hover:text-orange-300 font-medium"
                >
                  Read full review
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click hint for list view */}
      {!showFullContent && (
        <div className="text-xs text-zinc-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          Click to view full review
        </div>
      )}
    </div>
  );
};

export default ComicReview;
