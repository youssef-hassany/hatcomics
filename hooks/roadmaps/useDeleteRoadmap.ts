import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteRoadmap = async (roadmapId: string) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error Deleting roadmap");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-details"] });
    },
  });
};
