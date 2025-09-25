import { RoadmapType } from "@/types/Roadmap";
import { useQuery } from "@tanstack/react-query";

const getRoadmap = async (roadmapId: string) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}`);
    if (!response.ok) {
      throw new Error("Error getting roadmap details");
    }

    const data = await response.json();
    return data.data as RoadmapType;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetRoadmapDetails = (roadmapId: string | undefined) => {
  return useQuery({
    queryKey: ["roadmap-details", roadmapId],
    queryFn: () => getRoadmap(roadmapId as string),
    enabled: !!roadmapId,
  });
};
