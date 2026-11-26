import Link from "next/link";
import React from "react";
import Avatar from "../ui/avatar";
import { ThoughtPreviewType } from "@/types/BookClub";
import { getTimeAgo } from "@/lib/date";

const ThoughtPreview = (thought: ThoughtPreviewType) => {
  const { comic, createdAt, thoughtContent, thoughtId, user, hasSpoiler } =
    thought;

  return (
    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-300 h-full">
      <div className="flex flex-col h-full">
        {/* Header with Comic and User */}
        <div className="flex gap-3 mb-3">
          {/* Comic Cover */}
          <Link href={`/comics/${comic.id}`} className="flex-shrink-0">
            <div className="relative w-12 h-16 rounded-md overflow-hidden group">
              <img
                src={comic.image || "/placeholder-comic.jpg"}
                alt={comic.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/book-club/${thoughtId}`}
              className="block group-hover:text-orange-400 transition-colors"
            >
              <p className="text-sm text-zinc-100 font-medium mb-1">
                <span className="text-orange-400 hover:text-orange-300">
                  {user.username}
                </span>
              </p>
              <p className="text-xs text-zinc-400 line-clamp-1">{comic.name}</p>
            </Link>
          </div>

          {/* User Avatar */}
          <Avatar
            url={user.photo || "/placeholder-avatar.png"}
            username={user.username}
            className="w-8 h-8 flex-shrink-0"
          />
        </div>

        {/* Content Preview */}
        <Link href={`/book-club/${thoughtId}`} className="block flex-1">
          {hasSpoiler ? (
            <div className="w-fit px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
              <span className="text-orange-400 text-xs font-medium">
                Contains Spoiler
              </span>
            </div>
          ) : (
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-4 hover:text-zinc-300 transition-colors">
              {thoughtContent.length > 180
                ? `${thoughtContent.slice(0, 180)}...`
                : thoughtContent}
            </p>
          )}
        </Link>

        {/* Timestamp */}
        <p className="text-zinc-500 text-xs mt-2 pt-2 border-t border-zinc-700/50">
          {getTimeAgo(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ThoughtPreview;
