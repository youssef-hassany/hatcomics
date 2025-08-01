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
                  ? post._count.likes - 1
                  : post._count.likes + 1;

                return {
                  ...post,
                  _count: {
                    ...["_count"],
                    likes: newLikeCount,
                  },
                  isLikedByCurrentUser: !variables.isLiked,
                };
              }
              return post;
            }),
          })),
        };
      });

      // update the the bookmark states
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error, variables) => {
      toast.error(`Failed to ${variables.isLiked ? "unlike" : "like"} post`);
    },
  });
};
