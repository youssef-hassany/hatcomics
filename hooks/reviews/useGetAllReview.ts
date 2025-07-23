import { Review } from "@/types/Review";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ReviewsResponse {
  status: string;
  data: Review[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getAllReviews = async ({ pageParam = 1 }): Promise<ReviewsResponse> => {
  try {
    const response = await fetch(`/api/reviews?page=${pageParam}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetAllReviews = () => {
  return useInfiniteQuery({
    queryKey: ["reviews"],
    queryFn: getAllReviews,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
