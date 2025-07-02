import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const deletePost = async (postId: string) => {
  try {
    await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    toast.success("Post deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("failed deleting post");
  }
};

export const useDeletePost = () => {
  return useMutation({
    mutationKey: ["posts"],
    mutationFn: deletePost,
  });
};
