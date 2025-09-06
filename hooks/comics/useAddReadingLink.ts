import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  comicId: string;
  url: string;
  translatorName: string;
  color: string;
  language: string;
}

const addReadingLink = async (params: Params) => {
  try {
    const response = await fetch(
      `/api/comics/${params.comicId}/reading-links`,
      {
        body: JSON.stringify(params),
        method: "POST",
      }
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const useAddReadingLink = (comicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [comicId],
    mutationFn: addReadingLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [comicId] }),
  });
};
