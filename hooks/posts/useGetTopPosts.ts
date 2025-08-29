import { PostPreview } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getTopPosts = async () => {
  try {
    const response = await fetch("/api/posts/top");
    const data = await response.json();
    return data.data as PostPreview[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetTopPosts = () => {
  return useQuery({
    queryKey: ["top-posts"],
    queryFn: getTopPosts,
  });
};
