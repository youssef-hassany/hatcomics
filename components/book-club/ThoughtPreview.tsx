import Link from "next/link";
import React from "react";
import Avatar from "../ui/avatar";
import { ThoughtPreviewType } from "@/types/BookClub";
import { getTimeAgo } from "@/lib/date";

const ThoughtPreview = (thought: ThoughtPreviewType) => {
  const { comic, createdAt, thoughtContent, thoughtId, user, hasSpoiler } =
    thought;

  return (
    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 transition-all duration-200 group">
      <div className="flex gap-4">
        {/* Comic Cover Image */}
        <Link href={`/comics/${comic.id}`} className="flex-shrink-0 group">
          <div className="relative w-16 h-20 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-200">
            <img
              src={comic.image || "/placeholder-comic.jpg"}
              alt={comic.name}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
          </div>
        </Link>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/book-club/${thoughtId}`}
            className="block group-hover:text-orange-400 transition-colors duration-200"
          >
            <p className="text-zinc-100 font-medium mb-2">
              <span className="text-orange-400 hover:text-orange-300 transition-colors">
                {user.username}
              </span>{" "}
              added a post to{" "}
              <span className="text-zinc-300 hover:text-zinc-100 transition-colors">
                {comic.name}
              </span>{" "}
              book club
            </p>
          </Link>

          {/* Post Preview */}
          <Link href={`/book-club/${thoughtId}`} className="block">
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none prose-zinc rich-text-editor">
              {hasSpoiler ? (
                <p className="w-fit flex items-center gap-2 px-4 py-1 rounded-full border bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Spoiler
                </p>
              ) : (
                <p className="text-zinc-400 text-sm line-clamp-2 inline-block group-hover:text-zinc-300 transition-colors duration-200">
                  {thoughtContent.length > 150
                    ? `${thoughtContent.slice(0, 150)}...`
                    : thoughtContent}
                </p>
              )}
            </div>
          </Link>

          {/* Timestamp */}
          <p className="text-zinc-500 text-xs mt-2">{getTimeAgo(createdAt)}</p>
        </div>

        {/* User Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            url={user.photo || "/placeholder-avatar.png"}
            username={user.username}
            className="w-10 h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ThoughtPreview;
