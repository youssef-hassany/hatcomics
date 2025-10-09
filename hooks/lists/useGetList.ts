import { ListPreviewType } from "@/types/List";
import { useQuery } from "@tanstack/react-query";

interface ListResponse {
  status: string;
  data: ListPreviewType;
}

const getList = async (listId: string): Promise<ListPreviewType> => {
  try {
    const response = await fetch(`/api/list/${listId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch list");
    }

    const data: ListResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetList = (listId: string) => {
  return useQuery({
    queryKey: ["list", listId],
    queryFn: () => getList(listId),
    enabled: !!listId,
  });
};
