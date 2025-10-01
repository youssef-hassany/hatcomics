import React from "react";
import { ChevronRight, MessageCircle } from "lucide-react";
import Avatar from "../ui/avatar";
import PostLikeHandler from "./PostLikeHandler";
import BookmarkHandler from "./BookmarkHandler";
import { PostPreview } from "@/types/Post";

const PostCard: React.FC<{ post: PostPreview }> = ({ post }) => {
  return (
    <div className="group relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl p-6 border border-zinc-700/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 transition-all duration-300 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        {/* User Info */}
        <div className="flex items-center mb-5">
          <Avatar
            url={post.user.photo || "/placeholder-avatar.png"}
            username={post.user.username}
          />

          <div className="ml-3 flex-1">
            <h3 className="text-zinc-100 font-semibold text-base">
              {post.user.fullname}
            </h3>
            <p className="text-zinc-500 text-sm">@{post.user.username}</p>
          </div>
        </div>

        {/* Post Title */}
        <a href={`posts/${post.id}`} className="block mb-6">
          <h2 className="text-2xl font-bold text-white leading-tight">
            {post.title}
          </h2>
        </a>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-5" />

        {/* Engagement Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <PostLikeHandler post={post} />

            <div className="flex items-center space-x-2 text-zinc-400">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">
                {post._count.comments}
              </span>
            </div>

            <BookmarkHandler post={post} />
          </div>

          <a
            href={`/posts/${post.id}`}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            <span className="hidden sm:inline">Read More</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
