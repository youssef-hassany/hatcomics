import { ListType } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdatePayload {
  listId: string;
  title: string;
  image: File | null;
  type: ListType;
}

const updateList = async (payload: UpdatePayload) => {
  const { listId, title, image, type } = payload;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("type", type);

  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await fetch(`/api/list/${listId}`, {
      body: formData,
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("error updating list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-list"],
    mutationFn: updateList,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list", variables.listId],
      });
    },
  });
};
