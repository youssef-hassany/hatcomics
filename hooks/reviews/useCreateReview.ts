import { Post } from "@/types/Post";
import { useMutation } from "@tanstack/react-query";

interface Params {
  rating: number;
  description?: string;
  spoiler: boolean;
  comicId: string;
}

const createReview = async (params: Params): Promise<Post> => {
  try {
    const response = await fetch(`/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data.data as Post;
  } catch (error) {
    console.error("Failed to create Review:", error);
    throw error;
  }
};

export const useCreateReview = () => {
  return useMutation({
    mutationKey: ["create-review"],
    mutationFn: (params: Params) => createReview(params),
  });
};
