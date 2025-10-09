import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteList = async (listId: string) => {
  try {
    const response = await fetch(`/api/list/${listId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("error deleting list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-list"],
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
    },
  });
};
