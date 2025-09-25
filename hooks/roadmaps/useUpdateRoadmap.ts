import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  roadmapId: string;
  title: string;
  description: string;
}

const updateRoadmap = async (params: Params) => {
  try {
    const { description, roadmapId, title } = params;
    const response = await fetch(`/api/roadmaps/${roadmapId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: title, description: description }),
    });

    if (!response.ok) {
      throw new Error("Error Updating roadmap");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-details"] });
    },
  });
};
