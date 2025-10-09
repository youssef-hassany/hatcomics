import { ContentType } from "@/types/Common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface LikeArgs {
  contentId: string;
  contentType: ContentType;
  isLiked: boolean;
}

const toggleLike = async ({ contentId, isLiked, contentType }: LikeArgs) => {
  try {
    const response = await fetch(`/api/like/${contentId}`, {
      method: isLiked ? "DELETE" : "POST",
      body: JSON.stringify({ contentType }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${isLiked ? "unlike" : "like"} ${contentType}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["content-like"],
    mutationFn: toggleLike,
    onSuccess: (_, variables) => {
      // update the the content states
      queryClient.invalidateQueries({
        queryKey: [`${variables.contentType}s`, variables.contentId],
      });

      // update the the bookmark states
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error, variables) => {
      toast.error(
        `Failed to ${variables.isLiked ? "unlike" : "like"} ${
          variables.contentType
        }`
      );
    },
  });
};
