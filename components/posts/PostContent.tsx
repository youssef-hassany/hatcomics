"use client";

import { Clock, User } from "lucide-react";
import { Post } from "@/types/Post";
import { useGetPostById } from "@/hooks/posts/useGetPostById";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import PostContentSkeleton from "./PostContentSkeleton";
import PostActions from "./PostActions";
import EditPostForm from "./EditPostForm";
import { useState } from "react";

interface PostContentProps {
  initialPost: Post;
}

const PostContent = ({ initialPost }: PostContentProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: post, isPending } = useGetPostById(initialPost.id);
  const { data: loggedInUser } = useGetLoggedInUser();

  const isOwner = loggedInUser?.id === post?.userId;

  if (isPending) {
    return <PostContentSkeleton />;
  }

  if (isEditing && post) {
    return <EditPostForm post={post} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <div className="bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={post?.user?.photo || "/placeholder-avatar.png"}
                className="w-20 h-20 rounded-full"
                alt={post?.user?.fullname}
              />
              <div>
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">
                  {post?.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post?.user?.fullname}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post &&
                      new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PostActions
                postId={post?.id || ""}
                onEdit={() => setIsEditing(true)}
                isOwner={isOwner}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-zinc-100 prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-orange-400 prose-a:no-underline hover:prose-a:text-orange-300 hover:prose-a:underline
                prose-strong:text-zinc-100 prose-strong:font-semibold
                prose-code:bg-zinc-800 prose-code:text-orange-300 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:border prose-pre:border-zinc-800
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-400
                prose-ul:mb-6 prose-ol:mb-6
                prose-li:mb-2 prose-li:text-zinc-300
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-zinc-800"
              dangerouslySetInnerHTML={{ __html: post?.content || "" }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostContent;
