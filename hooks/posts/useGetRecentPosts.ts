import { PostPreview } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getRecentPosts = async () => {
  try {
    const response = await fetch("/api/posts/recent");
    const data = await response.json();
    return data.data as PostPreview[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: ["recent-posts"],
    queryFn: getRecentPosts,
  });
};
