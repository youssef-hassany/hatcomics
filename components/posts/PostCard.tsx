import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { PostPreview } from "@/types/Post";
import Link from "next/link";

const PostCard: React.FC<{ post: PostPreview }> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 hover:border-zinc-600 transition-colors">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          src={post.user.photo}
          alt={post.user.username}
          className="w-10 h-10 rounded-full"
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
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked
                ? "text-orange-400"
                : "text-zinc-400 hover:text-orange-400"
            }`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-sm">{post.likes.length}</span>
          </button>

          <div className="flex items-center space-x-2 text-zinc-400">
            <MessageCircle size={20} />
            <span className="text-sm">{post.comments.length}</span>
          </div>
        </div>

        <Link
          href={`posts/${post.id}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
