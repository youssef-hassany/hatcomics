import { Review } from "@/types/Review";
import { useQuery } from "@tanstack/react-query";

const getAllReviews = async () => {
  try {
    const response = await fetch("/api/reviews");
    const data = await response.json();
    return data.data as Review[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetAllReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: getAllReviews,
  });
};
