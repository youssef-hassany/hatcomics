import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeReadingLink = async ({
  comicId,
  readingLink,
}: {
  comicId: string;
  readingLink: string;
}) => {
  try {
    const response = await fetch(`/api/comics/${comicId}/reading-links`, {
      body: readingLink,
      method: "DELETE",
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const useRemoveReadingLink = (comicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [comicId],
    mutationFn: removeReadingLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [comicId] }),
  });
};
