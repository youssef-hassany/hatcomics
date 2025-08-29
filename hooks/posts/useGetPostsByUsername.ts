import { PostPreview } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getPostsByUsername = async (username: string) => {
  try {
    const response = await fetch(`/api/posts/profile/${username}`);
    const data = await response.json();
    return data.data as PostPreview[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetPostsByUsername = (username: string) => {
  return useQuery({
    queryKey: ["username-posts", username],
    queryFn: () => getPostsByUsername(username),
  });
};
