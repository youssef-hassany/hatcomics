import { Post } from "@/types/Post";
import { useMutation } from "@tanstack/react-query";

interface Params {
  title: string;
  content: string;
  userId: string;
}

const createPost = async (params: Params, isDraft = false): Promise<Post> => {
  try {
    const response = await fetch(`/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
        isDraft,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Post;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
};

export const useCreatePost = () => {
  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: (params: Params & { isDraft?: boolean }) =>
      createPost(params, params.isDraft),
  });
};
