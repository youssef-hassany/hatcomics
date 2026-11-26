import { ComicPreview } from "@/types/Comic";
import { useQuery } from "@tanstack/react-query";

interface Response {
  recommendations: ComicPreview[];
  totalReviews: number;
  preferencesAnalyzed: {
    topCharacters: string[];
    topAuthors: string[];
    topPublishers: string[];
    prefersIndie: boolean;
  };
}

const getComicsRecommendations = async () => {
  try {
    const response = await fetch("/api/comics/recommendations");
    const data = await response.json();
    return data as Response;
  } catch (error) {
    console.error(error);
  }
};

export const useGetComicsRecommendations = () => {
  return useQuery({
    queryKey: ["comic-recommendations"],
    queryFn: getComicsRecommendations,
  });
};
