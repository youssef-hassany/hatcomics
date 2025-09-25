import { useQuery } from "@tanstack/react-query";

type CommentType = "post" | "review" | "roadmap";

const getComments = async (id: string | undefined, type: CommentType) => {
  if (!id) return;

  try {
    const endpoint =
      type === "post" ? `/api/comment/${id}` : `/api/comment/${id}/${type}`;

    const response = await fetch(endpoint);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const useGetComments = (id: string | undefined, type: CommentType) => {
  return useQuery({
    queryKey: ["comments", id, type],
    queryFn: () => getComments(id, type),
    enabled: !!id,
  });
};
