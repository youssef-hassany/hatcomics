import { Review } from "@/types/Review";
import { useQuery } from "@tanstack/react-query";

const getReviewsByUsername = async (username: string) => {
  try {
    const response = await fetch(`/api/reviews/profile/${username}`);
    const data = await response.json();
    return data.data as Review[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetReviewsByUsername = (username: string) => {
  return useQuery({
    queryKey: ["username-reviews", username],
    queryFn: () => getReviewsByUsername(username),
  });
};
