import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PostLikeArgs {
  postId: string;
  isLiked: boolean;
}

const togglePostLike = async ({ postId, isLiked }: PostLikeArgs) => {
  try {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: isLiked ? "DELETE" : "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to ${isLiked ? "unlike" : "like"} post`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-like"],
    mutationFn: togglePostLike,
    onSuccess: (_, variables) => {
      // Update the infinite query cache
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) => {
              if (post.id === variables.postId) {
                const newLikeCount = variables.isLiked
                  ? (post.likes?.length || 0) - 1
                  : (post.likes?.length || 0) + 1;

                return {
                  ...post,
                  likes: Array.isArray(post.likes)
                    ? variables.isLiked
                      ? post.likes.slice(0, -1) // Remove last like
                      : [
                          ...post.likes,
                          {
                            /* mock like object */
                          },
                        ] // Add mock like
                    : { length: Math.max(0, newLikeCount) },
                  isLikedByCurrentUser: !variables.isLiked,
                };
              }
              return post;
            }),
          })),
        };
      });
    },
    onError: (error, variables) => {
      toast.error(`Failed to ${variables.isLiked ? "unlike" : "like"} post`);
    },
  });
};
