"use client";

import { useGetPostComments } from "@/hooks/comments/useGetPostComments";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { Comment as CommentType } from "@/types/Comment";
import { MessageCircle } from "lucide-react";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";

interface CommentsListProps {
  postId: string;
}

const CommentsList = ({ postId }: CommentsListProps) => {
  const { data: comments, isLoading, error } = useGetPostComments(postId);
  const { data: loggedInUser } = useGetLoggedInUser();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <p className="text-red-400 text-center">
          Failed to load comments. Please try again later.
        </p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg font-medium mb-2">
            No comments yet
          </p>
          <p className="text-zinc-500">
            Be the first to share your thoughts on this post!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {comments.map((comment: CommentType) => (
        <Comment
          key={comment.id}
          comment={comment}
          isOwner={loggedInUser?.id === comment.userId}
          postId={postId}
        />
      ))}
    </div>
  );
};

export default CommentsList;
