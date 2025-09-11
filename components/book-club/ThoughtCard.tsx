import React from "react";
import { MessageCircle, Eye } from "lucide-react";
import { ThoughtPreview } from "@/types/Post";
import Avatar from "../ui/avatar";
import PostLikeHandler from "../posts/PostLikeHandler";
import AttachmentsDisplay from "../common/AttachmentsDisplay";
import Link from "next/link";
import { getTimeAgo } from "@/lib/date";

const ThoughtCard: React.FC<{ thought: ThoughtPreview }> = ({ thought }) => {
  const renderSpoilerContent = () => {
    return (
      <div className="relative min-h-[120px]">
        {/* Blurred Content */}
        <div className="filter blur-md select-none pointer-events-none">
          <div className="text-white text-sm leading-relaxed mb-2">
            <p>{thought.content}</p>
          </div>
          {/* Blurred Attachments */}
          <AttachmentsDisplay attachments={thought.attachments} />
        </div>

        {/* Spoiler Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/40 backdrop-blur-sm rounded-lg min-h-[120px]">
          <div className="text-center px-4 py-3 max-w-full">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-orange-500/20 p-2 rounded-full">
                <Eye size={20} className="text-orange-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold text-base mb-1">
              Spoiler Content
            </h3>
            <p className="text-zinc-400 text-xs mb-3 leading-tight">
              This post contains spoilers
            </p>
            <div className="bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-md px-3 py-1.5 inline-block">
              <p className="text-zinc-300 text-xs whitespace-nowrap">
                Click to view
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Link
      href={`/book-club/${thought.id}`}
      className="bg-zinc-900 border-b border-zinc-800 hover:bg-zinc-900/80 transition-colors px-4 py-3 cursor-pointer"
    >
      <div className="flex space-x-3">
        {/* Avatar Column */}
        <div className="flex-shrink-0">
          <Avatar
            url={thought.user.photo || "/placeholder-avatar.png"}
            username={thought.user.username}
          />
        </div>

        {/* Main Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-bold text-sm hover:underline">
                {thought.user.fullname}
              </h3>
              <span className="text-zinc-500 text-sm">
                @{thought.user.username}
              </span>
              <span className="text-zinc-500 text-sm">·</span>
              <span className="text-zinc-500 text-sm hover:underline">
                {getTimeAgo(thought?.createdAt)}
              </span>
            </div>
          </div>

          {/* Content */}
          {thought.hasSpoiler ? (
            renderSpoilerContent()
          ) : (
            <>
              <div className="text-white text-sm leading-relaxed mb-2 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none prose-zinc rich-text-editor whitespace-pre-wrap">
                <p>{thought.content}</p>
              </div>
              {/* Attachments */}
              <AttachmentsDisplay attachments={thought.attachments} />
            </>
          )}

          {/* Engagement Actions */}
          <div className="flex items-center gap-6 max-w-md mt-3">
            {/* Likes */}
            {/* @ts-expect-error: this error here won't affect anything because the type requires title which is not used in the component */}
            <PostLikeHandler post={thought} />

            {/* Comments */}
            <div className="flex items-center space-x-2 text-zinc-500 hover:text-blue-400 transition-colors group">
              <button className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <MessageCircle size={16} />
              </button>
              <span className="text-sm">{thought._count.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThoughtCard;
