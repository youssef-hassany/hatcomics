import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const deleteComment = async (commentId: string) => {
  try {
    const response = await fetch(`/api/comment/${commentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    toast.success("Comment deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete comment, try again.");
    throw error;
  }
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: deleteComment,
    onSettled: () => {
      // Invalidate all comments queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
