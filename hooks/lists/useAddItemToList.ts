import { ListEntryMutation } from "@/types/List";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  listId: string;
  entry: ListEntryMutation;
}

const addEntry = async ({ entry, listId }: Params) => {
  try {
    const response = await fetch(`/api/list/${listId}/entries`, {
      method: "POST",
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error("Error adding Item to list");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useAddItemToList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-item-to-list"],
    mutationFn: addEntry,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["list", variables.listId] });
    },
  });
};
