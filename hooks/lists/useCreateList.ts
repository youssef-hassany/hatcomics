import { ListPreviewType } from "@/types/List";
import { ListType } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePayload {
  title: string;
  image: File | null;
  type: ListType;
}

const createList = async (payload: CreatePayload) => {
  const { title, image, type } = payload;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("type", type);
  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await fetch("/api/list", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("error creating list");
    }

    const data = await response.json();
    return data.data as ListPreviewType;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-list"],
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
    },
  });
};
