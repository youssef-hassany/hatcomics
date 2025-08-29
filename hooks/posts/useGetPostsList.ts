import { PostPreview } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";

interface PostsResponse {
  status: string;
  data: PostPreview[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getPosts = async ({ pageParam = 1 }): Promise<PostsResponse> => {
  try {
    const response = await fetch(`/api/posts?page=${pageParam}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetPostsList = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
