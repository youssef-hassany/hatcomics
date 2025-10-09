import { ReorderRequest } from "@/types/Roadmap";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  listId: string;
  newOrder: ReorderRequest;
}

const reorderListItems = async ({ listId, newOrder }: Params) => {
  try {
    const response = await fetch(`/api/list/${listId}/entries/reorder`, {
      body: JSON.stringify(newOrder),
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Error reordering items");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useReorderListItems = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reorder-list-items"],
    mutationFn: reorderListItems,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list", listId],
      });
    },
  });
};
