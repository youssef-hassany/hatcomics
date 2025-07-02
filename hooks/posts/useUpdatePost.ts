import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Params {
  title: string;
  content: string;
  isDraft: boolean;
}

export const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [postId],
    mutationFn: async (params: Params) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: [postId] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update post");
    },
  });
};
