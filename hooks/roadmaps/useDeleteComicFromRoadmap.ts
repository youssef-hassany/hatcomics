import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  roadmapId: string;
  entryId: string;
}

const deleteComic = async (params: Params) => {
  try {
    const { roadmapId, entryId } = params;
    const response = await fetch(
      `/api/roadmaps/${roadmapId}/entries/${entryId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error Deleting Comic From Roadmap");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useDeleteComicFromRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-details"] });
    },
  });
};
