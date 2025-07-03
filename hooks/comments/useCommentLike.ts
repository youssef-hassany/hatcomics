import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CommentLikeArgs {
  commentId: string;
  isLiked: boolean;
}

const toggleCommentLike = async ({ commentId, isLiked }: CommentLikeArgs) => {
  try {
    const response = await fetch(`/api/comment/${commentId}/like`, {
      method: isLiked ? "DELETE" : "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to ${isLiked ? "unlike" : "like"} comment`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["comment-like"],
    mutationFn: toggleCommentLike,
    onSuccess: (_, variables) => {
      // Optimistically update the comments cache
      queryClient.setQueriesData({ queryKey: ["comments"] }, (oldData: any) => {
        if (!oldData) return oldData;

        return oldData.map((comment: any) => {
          if (comment.id === variables.commentId) {
            const newLikeCount = variables.isLiked
              ? (comment.likes?.length || 0) - 1
              : (comment.likes?.length || 0) + 1;

            return {
              ...comment,
              likes: {
                ...comment.likes,
                length: Math.max(0, newLikeCount),
              },
              isLikedByCurrentUser: !variables.isLiked, // Toggle the like status
            };
          }
          return comment;
        });
      });
    },
    onError: (error, variables) => {
      toast.error(`Failed to ${variables.isLiked ? "unlike" : "like"} comment`);
    },
  });
};
