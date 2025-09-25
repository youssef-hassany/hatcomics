import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CommentType = "post" | "review" | "roadmap";

interface CreateCommentArgs {
  id: string;
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
    } else if (type === "review") {
      endpoint = `/api/comment/${id}${
        commentId ? `/reply/${commentId}` : ""
      }/review`;
    } else if (type === "roadmap") {
      endpoint = `/api/comment/${id}${
        commentId ? `/reply/${commentId}` : ""
      }/roadmap`;
    } else {
      throw new Error(`Unsupported comment type: ${type}`);
    }

    await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    toast.success(`${commentId ? "Reply" : "Comment"} added successfully`);
  } catch (error) {
    console.error(error);
    toast.error(`failed to add ${commentId ? "Reply" : "Comment"}, try again.`);
    throw error;
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
