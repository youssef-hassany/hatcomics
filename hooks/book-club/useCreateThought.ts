import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  formData: FormData;
  comicId: string;
}

const createThought = async (params: Params) => {
  try {
    const response = await fetch(`/api/comics/${params.comicId}/book-club`, {
      method: "POST",
      body: params.formData,
    });

    if (!response.ok) throw new Error("error creating thought");

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const useCreateThought = (comicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["book-club", comicId],
    mutationFn: createThought,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["book-club", comicId] }),
  });
};
