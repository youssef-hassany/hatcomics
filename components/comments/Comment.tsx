"use client";

import { Comment as CommentType } from "@/types/Comment";
import { useDeleteComment } from "@/hooks/comments/useDeleteComment";
import { useUpdateComment } from "@/hooks/comments/useUpdateComment";
import { useCommentLike } from "@/hooks/comments/useCommentLike";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useState } from "react";

interface CommentProps {
  comment: CommentType;
  onDelete?: (commentId: string) => void;
  isOwner?: boolean;
}

const Comment = ({ comment, onDelete, isOwner }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();
  const likeCommentMutation = useCommentLike();

  // Use the like status from the API response
  const isLiked = comment.isLikedByCurrentUser || false;
  const likeCount = comment.likes?.length || 0;

  const handleLike = async () => {
    try {
      await likeCommentMutation.mutateAsync({
        commentId: comment.id,
        isLiked: isLiked,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommentMutation.mutateAsync(comment.id);
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;

    try {
      await updateCommentMutation.mutateAsync({
        commentId: comment.id,
        content: editContent.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <div className="bg-zinc-900 border-b border-zinc-700 p-6">
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img
            src={comment.user?.photo || "/placeholder-avatar.png"}
            alt={comment.user?.fullname || "User"}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1 space-y-3">
          {/* User Info and Timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-100">
                {comment.user?.fullname || "Anonymous"}
              </span>
              <span className="text-sm text-zinc-500">
                @{comment.user?.username || "user"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-zinc-500">
                <Clock className="w-3 h-3" />
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Actions Menu for comment owner */}
              {isOwner && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-6 w-6 p-0 flex items-center justify-center text-zinc-500 hover:text-zinc-400 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-800 border-zinc-700"
                  >
                    <DropdownMenuItem
                      onClick={handleEdit}
                      className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-400 hover:text-red-300 hover:bg-zinc-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Comment Text or Edit Form */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Edit your comment..."
                disabled={updateCommentMutation.isPending}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={
                    !editContent.trim() || updateCommentMutation.isPending
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                >
                  {updateCommentMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span className="ml-1">
                    {updateCommentMutation.isPending ? "Saving..." : "Save"}
                  </span>
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={updateCommentMutation.isPending}
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                >
                  <X className="w-4 h-4" />
                  <span className="ml-1">Cancel</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-zinc-300 leading-relaxed">
                {comment.content}
              </div>

              {/* Attachment */}
              {comment.attachment && (
                <div className="mt-3">
                  <img
                    src={comment.attachment}
                    alt="Comment attachment"
                    className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                  />
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-2">
            <button
              onClick={handleLike}
              disabled={likeCommentMutation.isPending}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isLiked
                  ? "text-orange-500 hover:text-orange-400"
                  : "text-zinc-500 hover:text-zinc-400"
              } ${
                likeCommentMutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {likeCommentMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              )}
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
