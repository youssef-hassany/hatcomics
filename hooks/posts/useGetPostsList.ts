import { PostPreview } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getPosts = async () => {
  try {
    const response = await fetch("/api/posts");
    const data = await response.json();
    return data.data as PostPreview[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetPostsList = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};
