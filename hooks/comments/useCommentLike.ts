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
      // Update the comments cache
      queryClient.setQueriesData({ queryKey: ["comments"] }, (oldData: any) => {
        if (!oldData) return oldData;

        // Handle both array and paginated data structures
        if (Array.isArray(oldData)) {
          return oldData.map((comment: any) => {
            if (comment.id === variables.commentId) {
              const currentLikeCount = comment.likes?.length || 0;
              const newLikeCount = variables.isLiked
                ? Math.max(0, currentLikeCount - 1)
                : currentLikeCount + 1;

              return {
                ...comment,
                likes: {
                  ...comment.likes,
                  length: newLikeCount,
                },
                isLikedByCurrentUser: !variables.isLiked,
              };
            }
            return comment;
          });
        }

        // Handle paginated structure if needed
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((comment: any) => {
                if (comment.id === variables.commentId) {
                  const currentLikeCount = comment.likes?.length || 0;
                  const newLikeCount = variables.isLiked
                    ? Math.max(0, currentLikeCount - 1)
                    : currentLikeCount + 1;

                  return {
                    ...comment,
                    likes: {
                      ...comment.likes,
                      length: newLikeCount,
                    },
                    isLikedByCurrentUser: !variables.isLiked,
                  };
                }
                return comment;
              }),
            })),
          };
        }

        return oldData;
      });
    },
    onError: (error, variables) => {
      toast.error(`Failed to ${variables.isLiked ? "unlike" : "like"} comment`);
    },
  });
};
