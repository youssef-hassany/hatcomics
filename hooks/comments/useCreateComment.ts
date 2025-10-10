import { ContentType } from "@/types/Common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCommentArgs {
  type: ContentType;
  commentId?: string;
  formData: FormData;
  contentId: string;
}

const createComment = async ({
  commentId,
  formData,
  contentId,
  type,
}: CreateCommentArgs) => {
  try {
    let endpoint = `/api/comment/${contentId}`;

    if (commentId) {
      endpoint = `${endpoint}/reply/${commentId}`;
    }

    await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    toast.success(`${commentId ? "Reply" : "Comment"} added successfully`);
    console.log(type);
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
        queryKey: ["comments", variables.contentId],
      });
    },
  });
};
