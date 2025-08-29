import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BookmarksArgs {
  postId: string;
  isBookmarked: boolean;
}

const toggleBookmark = async ({ postId, isBookmarked }: BookmarksArgs) => {
  try {
    const response = await fetch(`/api/posts/${postId}/bookmarks`, {
      method: isBookmarked ? "DELETE" : "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${isBookmarked ? "unbookmark" : "bookmark"} post`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bookmarks"],
    mutationFn: toggleBookmark,
    onSuccess: (_, variables) => {
      // Update the infinite query data for posts list
      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) => {
              if (post.id === variables.postId) {
                return {
                  ...post,
                  isBookmarked: !variables.isBookmarked,
                  _count: {
                    ...post._count,
                    bookmarks: variables.isBookmarked
                      ? post._count.bookmarks - 1
                      : post._count.bookmarks + 1,
                  },
                };
              }
              return post;
            }),
          })),
        };
      });

      // Show appropriate success message
      toast.success(
        variables.isBookmarked
          ? "Post removed from bookmarks"
          : "Post added to bookmarks"
      );
    },
    onError: (error, variables) => {
      toast.error(
        `Failed to ${variables.isBookmarked ? "unbookmark" : "bookmark"} post`
      );
    },
  });
};
