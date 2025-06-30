import { ComicPreview } from "@/types/Comic";
import { useQuery } from "@tanstack/react-query";

const fetchComicsList = async () => {
  try {
    const response = await fetch("/api/comics");
    const data = await response.json();
    return data.data as ComicPreview;
  } catch (error) {
    console.error(error);
  }
};

export const useGetComicsList = () => {
  return useQuery({
    queryKey: ["comics"],
    queryFn: fetchComicsList,
  });
};
