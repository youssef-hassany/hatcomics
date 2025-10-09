import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  listId: string;
  entryId: string;
}

const deleteItem = async (params: Params) => {
  try {
    const { listId, entryId } = params;
    const response = await fetch(`/api/list/${listId}/entries/${entryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error Deleting Item From List");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useDeleteItemFromList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["list", variables.listId] });
    },
  });
};
