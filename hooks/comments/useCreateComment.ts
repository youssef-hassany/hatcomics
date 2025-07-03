import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCommentArgs {
  postId: string;
  formData: FormData;
}

const createComment = async ({ postId, formData }: CreateCommentArgs) => {
  try {
    await fetch(`/api/comment/${postId}`, {
      method: "POST",
      body: formData,
    });

    toast.success("comment added successfully");
  } catch (error) {
    console.error(error);
    toast.error("failed to add comment, try again.");
  }
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-comment"],
    mutationFn: createComment,
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
};
