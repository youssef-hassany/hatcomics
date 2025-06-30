import { ComicIssue } from "@/types/comic-vine";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

interface ComicResponse {
  results: ComicIssue[];
  totalResults: number;
  page: number;
  limit: number;
  hasMore: boolean;
  offset: number;
}

interface FetchComicsParams {
  query: string;
  resource?: string;
  page?: number;
  limit?: number;
}

const fetchComics = async ({
  query,
  resource = "issue",
  page = 1,
  limit = 20,
}: FetchComicsParams): Promise<ComicResponse> => {
  const response = await axios.get("/api/comicvine", {
    params: {
      q: query,
      resource,
      page,
      limit,
    },
  });
  return response.data;
};

export const useGetComicVineComics = (
  query: string,
  resource: string = "volume",
  initialLimit: number = 20,
  limitIncrement: number = 20
) => {
  const queryResult = useInfiniteQuery({
    queryKey: ["comics", query, resource, initialLimit, limitIncrement],
    queryFn: ({ pageParam = initialLimit }) =>
      fetchComics({ query, resource, page: 1, limit: pageParam }),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.hasMore && lastPage.results.length === lastPageParam) {
        return lastPageParam + limitIncrement;
      }
      return undefined;
    },
    initialPageParam: initialLimit,
  });

  // Transform the data to show only the latest page (highest limit) results
  const transformedData = useMemo(() => {
    if (!queryResult.data) return undefined;

    // Get the last page which has the most results
    const lastPage = queryResult.data.pages[queryResult.data.pages.length - 1];

    return {
      pages: [lastPage], // Only show the latest page
      pageParams: queryResult.data.pageParams,
    };
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: transformedData,
  };
};

// Alternative hook for regular pagination (non-infinite)
// export const useGetComicVineComicsPaginated = (
//   query: string,
//   resource: string = "issue",
//   page: number = 1,
//   limit: number = 20
// ) => {
//   return useQuery({
//     queryKey: ["comics-paginated", query, resource, page, limit],
//     queryFn: () => fetchComics({ query, resource, page, limit }),
//     enabled: !!query,
//     staleTime: 1000 * 60 * 5,
//   });
// };
