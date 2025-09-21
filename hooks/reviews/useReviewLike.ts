import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewLikeArgs {
  reviewId: string;
  isLiked: boolean;
}

const toggleReviewLike = async ({ reviewId, isLiked }: ReviewLikeArgs) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}/like`, {
      method: isLiked ? "DELETE" : "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to ${isLiked ? "unlike" : "like"} review`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useReviewLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["review-like"],
    mutationFn: toggleReviewLike,
    onSuccess: (_, variables) => {
      // Update the infinite query cache
      queryClient.setQueriesData({ queryKey: ["reviews"] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((review: any) => {
              if (review.id === variables.reviewId) {
                const newLikeCount = variables.isLiked
                  ? review._count.likes - 1
                  : review._count.likes + 1;

                return {
                  ...review,
                  _count: {
                    ...review._count,
                    likes: newLikeCount,
                  },
                  isLikedByCurrentUser: !variables.isLiked,
                };
              }
              return review;
            }),
          })),
        };
      });

      // update the the bookmark states
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error, variables) => {
      toast.error(`Failed to ${variables.isLiked ? "unlike" : "like"} review`);
    },
  });
};
