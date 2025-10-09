import { ListPreviewType } from "@/types/List";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ListsResponse {
  status: string;
  data: ListPreviewType[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getLists = async ({
  pageParam = 1,
  filter,
}: {
  pageParam?: number;
  filter: string;
}): Promise<ListsResponse> => {
  try {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      ...(filter && { filter }),
    });

    const response = await fetch(`/api/list?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lists");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetAllLists = (filter: string) => {
  return useInfiniteQuery({
    queryKey: ["lists", filter],
    queryFn: ({ pageParam = 1 }) => getLists({ pageParam, filter }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
  });
};
