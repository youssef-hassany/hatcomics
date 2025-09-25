import { RoadmapPreviewType } from "@/types/Roadmap";
import { useQuery } from "@tanstack/react-query";

const getRoadmpasDrafts = async () => {
  try {
    const response = await fetch("/api/roadmaps/me");
    if (!response.ok) {
      throw new Error("error getting your roadmaps");
    }

    const data = await response.json();
    return data.data as RoadmapPreviewType[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetRoadmapDrafts = () => {
  return useQuery({
    queryKey: ["roadmaps-draft"],
    queryFn: getRoadmpasDrafts,
  });
};
