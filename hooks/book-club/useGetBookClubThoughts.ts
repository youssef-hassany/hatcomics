import { ThoughtPreview } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";

interface PostsResponse {
  status: string;
  data: ThoughtPreview[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getThoughts = async (
  comicId: string,
  { pageParam = 1 }
): Promise<PostsResponse> => {
  try {
    const response = await fetch(
      `/api/comics/${comicId}/book-club?page=${pageParam}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetBookClubThoughts = (comicId: string) => {
  return useInfiniteQuery({
    queryKey: ["book-club", comicId],
    queryFn: ({ pageParam }) => getThoughts(comicId, { pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
