import { ReorderRequest } from "@/types/Roadmap";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  roadmapId: string;
  newOrder: ReorderRequest;
}

const reorderComics = async ({ roadmapId, newOrder }: Params) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}/entries/reorder`, {
      body: JSON.stringify(newOrder),
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Error reordering comics");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useReorderComics = (roadmapId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reorder"],
    mutationFn: reorderComics,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roadmap-details", roadmapId],
      });
    },
  });
};
