import { Post } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const getDrafts = async () => {
  try {
    const response = await fetch("/api/posts/drafts");
    const data = await response.json();
    return data.data as Post[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetUserDrafts = () => {
  return useQuery({
    queryKey: ["drafts"],
    queryFn: getDrafts,
  });
};
