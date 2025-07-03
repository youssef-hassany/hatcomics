import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateCommentArgs {
  commentId: string;
  content: string;
}

const updateComment = async ({ commentId, content }: UpdateCommentArgs) => {
  try {
    const response = await fetch(`/api/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to update comment");
    }

    const data = await response.json();
    toast.success("Comment updated successfully");
    return data.data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to update comment, try again.");
    throw error;
  }
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-comment"],
    mutationFn: updateComment,
    onSettled: () => {
      // Invalidate all comments queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
