import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CommentType = "post" | "review";

interface CreateCommentArgs {
  id: string; // postId or reviewId
  type: CommentType;
  commentId?: string;
  formData: FormData;
}

const createComment = async ({
  id,
  type,
  commentId,
  formData,
}: CreateCommentArgs) => {
  try {
    let endpoint: string;

    if (type === "post") {
      endpoint = `/api/comment/${id}${commentId ? `/reply/${commentId}` : ""}`;
    } else {
      endpoint = `/api/comment/${id}${
        commentId ? `/reply/${commentId}` : ""
      }/review`;
    }

    await fetch(endpoint, {
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
        queryKey: ["comments", variables.id, variables.type],
      });
    },
  });
};
