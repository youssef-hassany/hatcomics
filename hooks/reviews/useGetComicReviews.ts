import { Review } from "@/types/Review";
import { useQuery } from "@tanstack/react-query";

const getComicReviews = async (comicId: string) => {
  try {
    const response = await fetch(`/api/reviews/comic/${comicId}`);
    const data = await response.json();
    return data.data as Review[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetComicReviews = (comicId: string) => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => getComicReviews(comicId),
  });
};
