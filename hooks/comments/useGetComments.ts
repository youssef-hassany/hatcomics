import { ContentType } from "@/types/Common";
import { useQuery } from "@tanstack/react-query";

const getComments = async (
  contentId: string | undefined,
  contentType: ContentType
) => {
  if (!contentId) return;

  try {
    const endpoint = `/api/comment/${contentId}?contentType=${encodeURIComponent(
      contentType
    )}`;

    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Error loading comments");

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetComments = (
  contentId: string | undefined,
  contentType: ContentType
) => {
  return useQuery({
    queryKey: ["comments", contentId],
    queryFn: () => getComments(contentId, contentType),
    enabled: !!contentId,
  });
};
