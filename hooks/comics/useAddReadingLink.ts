import { useMutation, useQueryClient } from "@tanstack/react-query";

const addReadingLink = async ({
  comicId,
  readingLink,
}: {
  comicId: string;
  readingLink: string;
}) => {
  try {
    const response = await fetch(`/api/comics/${comicId}/reading-links`, {
      body: JSON.stringify({ link: readingLink }),
      method: "PATCH",
    });

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
