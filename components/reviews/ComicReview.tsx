"use client";

import { Star, Eye, EyeOff, Calendar, Book } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReviewActions from "./ReviewActions";

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
}: ComicReviewProps) => {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Check if content is long enough to need truncation
  const isLongContent = content && content.length > 300;
  const displayContent =
    isLongContent && !isExpanded ? `${content.slice(0, 300)}...` : content;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 transition-all duration-200 hover:border-zinc-700">
      {/* Comic Info Section - Clickable */}
      <Link href={`/comics/${comic.id}`} className="block">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-700 hover:bg-zinc-750 transition-colors duration-200 rounded-lg p-2 -m-2">
          <div className="flex-shrink-0">
            {comic.image ? (
              <img
                src={comic.image}
                alt={comic.name}
                className="w-12 h-16 rounded border border-zinc-700 object-cover"
              />
            ) : (
              <div className="w-12 h-16 rounded border border-zinc-700 bg-zinc-700 flex items-center justify-center">
                <Book className="w-6 h-6 text-zinc-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-100 truncate text-lg">
              {comic.name}
            </h3>
            {comic.numberOfIssues && (
              <p className="text-zinc-400 text-sm">
                Issues: {comic.numberOfIssues}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <img
              src={user.photo || "/placeholder-avatar.png"}
              alt={user.fullname}
              className="w-12 h-12 rounded-full border-2 border-zinc-700"
            />
          </div>

          {/* User Info & Rating */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-zinc-100 truncate">
                {user.fullname}
              </h4>
              <span className="text-zinc-500 text-sm">@{user.username}</span>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating
                        ? "text-orange-400 fill-current"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-400">{rating}/5</span>
            </div>
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Calendar className="w-3 h-3" />
            <time dateTime={new Date(createdAt).toISOString()}>
              {formatDate(new Date(createdAt))}
            </time>
          </div>

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
            <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
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

              <div className="prose prose-sm prose-invert max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed">
                <p className="whitespace-pre-wrap">{displayContent}</p>
              </div>

              {/* Expand/Collapse for long content */}
              {isLongContent && (
                <button
                  onClick={toggleExpanded}
                  className="mt-2 text-sm text-orange-400 hover:text-orange-300 font-medium"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComicReview;
