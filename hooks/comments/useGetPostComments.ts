import { useQuery } from "@tanstack/react-query";

const getPostComments = async (postId: string) => {
  try {
    const response = await fetch(`/api/comment/${postId}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const useGetPostComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
  });
};
