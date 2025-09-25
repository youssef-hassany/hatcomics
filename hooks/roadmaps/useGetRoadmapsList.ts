import { RoadmapPreviewType } from "@/types/Roadmap";
import { useInfiniteQuery } from "@tanstack/react-query";

interface RoadmapsResponse {
  status: string;
  data: RoadmapPreviewType[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getRoadmaps = async ({
  pageParam = 1,
  searchParam = "",
}): Promise<RoadmapsResponse> => {
  try {
    const response = await fetch(
      `/api/roadmaps?page=${pageParam}&search=${searchParam}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetRoadmapsList = (searchParam = "") => {
  return useInfiniteQuery({
    queryKey: ["roadmaps", searchParam],
    queryFn: ({ pageParam }) => getRoadmaps({ pageParam, searchParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
