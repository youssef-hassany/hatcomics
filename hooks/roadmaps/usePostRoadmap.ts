import { useMutation } from "@tanstack/react-query";

const postRoadmap = async (roadmapId: string) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}/post`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Error posting Roadmap");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const usePostRoadmap = () => {
  return useMutation({
    mutationKey: ["post-roadmap"],
    mutationFn: postRoadmap,
  });
};
