import React from "react";
import { ChevronRight, MessageCircle } from "lucide-react";
import Avatar from "../ui/avatar";
import PostLikeHandler from "./PostLikeHandler";
import BookmarkHandler from "./BookmarkHandler";
import { PostPreview } from "@/types/Post";
import ComponentProtector from "../common/ComponentProtector";
import UserInfo from "../ui/user-info";
import { resolveActiveBadge } from "@/lib/active-badge-resolver";

const PostCard: React.FC<{ post: PostPreview }> = ({ post }) => {
  return (
    <div className="group relative bg-zinc-800/60 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-300 h-full">
      <div className="flex flex-col h-full">
        {/* User Info */}
        <div className="flex items-center mb-3">
          <Avatar
            url={post.user.photo || "/placeholder-avatar.png"}
            username={post.user.username}
            className="w-8 h-8"
          />

          <span className="ml-2">
            <UserInfo
              fullname={post.user.fullname}
              points={post.user.points}
              username={post.user.username}
              activeBadge={resolveActiveBadge(
                post.user.points,
                post.user.badges,
              )}
            />
          </span>
        </div>

        {/* Post Title */}
        <a href={`/posts/${post.id}`} className="block mb-auto">
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-3 group-hover:text-orange-400 transition-colors">
            {post.title}
          </h2>
        </a>

        {/* Divider */}
        <div className="h-px bg-zinc-700/50 my-3" />

        {/* Engagement Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ComponentProtector>
              <PostLikeHandler post={post} />
            </ComponentProtector>

            <div className="flex items-center space-x-1 text-zinc-400">
              <MessageCircle size={16} />
              <span className="text-xs font-medium">
                {post._count.comments}
              </span>
            </div>

            <BookmarkHandler post={post} />
          </div>

          <a
            href={`/posts/${post.id}`}
            className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-orange-500/20 active:scale-95"
          >
            Read
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
