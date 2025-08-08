import { ComicPreview } from "@/types/Comic";
import { useQuery } from "@tanstack/react-query";

const getTopComics = async () => {
  try {
    const response = await fetch("/api/comics/top");
    const data = await response.json();
    return data.data as ComicPreview[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetTopComics = () => {
  return useQuery({
    queryKey: ["top-comics"],
    queryFn: getTopComics,
  });
};
