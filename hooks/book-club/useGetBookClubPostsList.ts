import { ThoughtPreviewResponse } from "@/types/BookClub";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Response {
  status: string;
  data: ThoughtPreviewResponse[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getLatestThoughts = async ({ pageParam = 1 }): Promise<Response> => {
  try {
    const response = await fetch(`/api/book-club?page=${pageParam}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetBookClubPostsList = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getLatestThoughts,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
