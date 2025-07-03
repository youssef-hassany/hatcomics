import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const deleteReview = async (reviewId: string) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete review");
    }

    toast.success("Review deleted, You Lost 2 points.");
  } catch (error) {
    console.error(error);
    toast.error(
      error instanceof Error ? error.message : "Failed deleting review"
    );
    throw error;
  }
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reviews"],
    mutationFn: deleteReview,
    onSuccess: () => {
      // Invalidate and refetch reviews queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["comic-reviews"] });
    },
  });
};
