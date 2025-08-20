"use client";

import { Clock, User } from "lucide-react";
import { Post } from "@/types/Post";
import { useGetPostById } from "@/hooks/posts/useGetPostById";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import PostContentSkeleton from "./PostContentSkeleton";
import PostActions from "./PostActions";
import EditPostForm from "./EditPostForm";
import CommentsSection from "../comments/CommentsSection";
import { useState } from "react";
import Avatar from "../ui/avatar";
import PostLikeHandler from "./PostLikeHandler";
import BookmarkHandler from "./BookmarkHandler";
import ComponentProtector from "../common/ComponentProtector";

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
    <div className="min-h-screen bg-zinc-900">
      {/* Header Section */}
      <div className="bg-zinc-800 border-b border-zinc-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar
                url={post?.user?.photo || "/placeholder-avatar.png"}
                className="w-16 h-16"
                username={post?.user?.username || "username"}
                height={64}
                width={64}
              />
              <div>
                <h1 className="text-2xl font-bold text-zinc-100 mb-2">
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
              {post && (
                <ComponentProtector>
                  <PostActions
                    postId={post?.id || ""}
                    onEdit={() => setIsEditing(true)}
                    isOwner={isOwner}
                  />
                </ComponentProtector>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Styled like the Rich Text Editor */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-600 overflow-hidden mb-8">
          <div className="p-3">
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] prose-zinc rich-text-editor"
              dangerouslySetInnerHTML={{ __html: post?.content || "" }}
            />
          </div>

          <div className="flex items-center gap-4 border-t border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 p-4">
            {/* @ts-expect-error: this is completely fine */}
            <PostLikeHandler post={post} />

            {/* @ts-expect-error: this is completely fine */}
            <BookmarkHandler post={post} />
          </div>
        </article>
      </div>

      {/* Comments Section */}
      <CommentsSection postId={post?.id || ""} />
    </div>
  );
};

export default PostContent;
