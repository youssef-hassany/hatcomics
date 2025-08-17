import { Review } from "@/types/Review";
import { useQuery } from "@tanstack/react-query";

export const getReview = async (reviewId: string) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`);
    const data = await response.json();
    return data.data as Review;
  } catch (error) {
    console.error(error);
  }
};

export const useGetReview = (reviewId: string) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => getReview(reviewId),
  });
};
