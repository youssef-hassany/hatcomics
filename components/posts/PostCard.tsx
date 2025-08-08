import React from "react";
import { ChevronRight, MessageCircle } from "lucide-react";
import { PostPreview } from "@/types/Post";
import Link from "next/link";
import Avatar from "../ui/avatar";
import PostLikeHandler from "./PostLikeHandler";
import BookmarkHandler from "./BookmarkHandler";

const PostCard: React.FC<{ post: PostPreview }> = ({ post }) => {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 hover:border-zinc-600 transition-colors">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <Avatar
          url={post.user.photo || "/placeholder-avatar.png"}
          username={post.user.username}
        />

        <div className="ml-3">
          <h3 className="text-zinc-200 font-medium">{post.user.fullname}</h3>
        </div>
      </div>

      {/* Post Title */}
      <Link
        href={`posts/${post.id}`}
        className="text-xl font-bold text-white mb-4 hover:text-orange-400 cursor-pointer transition-colors"
      >
        {post.title}
      </Link>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <PostLikeHandler post={post} />

          <div className="flex items-center space-x-2 text-zinc-400">
            <MessageCircle size={20} />
            <span className="text-sm">{post._count.comments}</span>
          </div>

          <BookmarkHandler post={post} />
        </div>

        <Link
          href={`posts/${post.id}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
        >
          <span className="hidden md:inline">Read More</span>
          <ChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
