import { ComicIssue } from "@/types/comic-vine";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the response type that can be either an issue or volume
// type ComicData = ComicIssue | ComicVolume;

interface ComicByIdResponse {
  results: any;
  status_code: number;
  error: string;
}

interface FetchComicByIdParams {
  id: string | number;
  resource: "issue" | "volume";
}

const fetchComicById = async ({
  id,
  resource,
}: FetchComicByIdParams): Promise<ComicByIdResponse> => {
  const response = await axios.get(`/api/comicvine/${resource}/${id}`);
  return response.data;
};

export const useGetComicVineComicById = (
  id: string | number | null | undefined,
  resource: "issue" | "volume" = "issue"
) => {
  return useQuery({
    queryKey: ["comic", resource, id],
    queryFn: () => fetchComicById({ id: id!, resource }),
    enabled: !!id, // Only run query if ID exists
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes since individual comics don't change often
    retry: 2,
  });
};

// Alternative hook if you want to determine the resource type automatically
// This would require additional logic to detect the resource type
// export const useGetComicVineComicById = (
//   id: string | number | null | undefined
// ) => {
//   // First try to fetch as an issue
//   const issueQuery = useQuery({
//     queryKey: ["comic", "issue", id],
//     queryFn: () => fetchComicById({ id: id!, resource: "issue" }),
//     enabled: !!id,
//     staleTime: 1000 * 60 * 10,
//     retry: false, // Don't retry on failure for auto-detection
//   });

//   // If issue fails, try volume
//   const volumeQuery = useQuery({
//     queryKey: ["comic", "volume", id],
//     queryFn: () => fetchComicById({ id: id!, resource: "volume" }),
//     enabled: !!id && issueQuery.isError,
//     staleTime: 1000 * 60 * 10,
//     retry: 2,
//   });

//   // Return the successful query result
//   if (issueQuery.isSuccess) {
//     return { ...issueQuery, resourceType: "issue" as const };
//   }

//   if (volumeQuery.isSuccess) {
//     return { ...volumeQuery, resourceType: "volume" as const };
//   }

//   // Return the issue query by default (for loading states, errors, etc.)
//   return { ...issueQuery, resourceType: "issue" as const };
// };
