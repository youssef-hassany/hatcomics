import { PostWithUser } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getPost = async (postId: string) => {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    const data = await response.json();
    return data.data as PostWithUser;
  } catch (error) {
    console.error(error);
  }
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [postId],
    queryFn: () => getPost(postId),
  });
};
