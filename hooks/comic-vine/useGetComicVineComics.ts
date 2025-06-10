import { ComicIssue } from "@/types/comic-vine";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchComics = async (query: string) => {
  const response = await axios.get("/api/comics", {
    params: { q: query },
  });
  return response.data as ComicIssue[];
};

export const useGetComicVineComics = (query: string) => {
  return useQuery({
    queryKey: ["comics", query],
    queryFn: () => fetchComics(query),
    enabled: !!query, // only run if query exists
    staleTime: 1000 * 60 * 5,
  });
};
