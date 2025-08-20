import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCommentArgs {
  postId: string;
  commentId?: string;
  formData: FormData;
}

const createComment = async ({
  postId,
  commentId,
  formData,
}: CreateCommentArgs) => {
  try {
    await fetch(`/api/comment/${postId}${commentId && `/reply/${commentId}`}`, {
      method: "POST",
      body: formData,
    });

    toast.success(`${commentId ? "Reply" : "Comment"} added successfully`);
  } catch (error) {
    console.error(error);
    toast.error(`failed to add ${commentId ? "Reply" : "Comment"}, try again.`);
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
