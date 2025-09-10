import { ThoughtPreview } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getThought = async (thoughtId: string) => {
  try {
    const response = await fetch(`/api/book-club/${thoughtId}`);
    const data = await response.json();
    return data.data as ThoughtPreview;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetThought = (thoughtId: string) => {
  return useQuery({
    queryKey: ["thought", thoughtId],
    queryFn: () => getThought(thoughtId),
  });
};
