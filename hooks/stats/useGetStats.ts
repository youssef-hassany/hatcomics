import { useQuery } from "@tanstack/react-query";

interface Stats {
  usersNum: number;
  reviewsNum: number;
  postsNum: number;
}

const fetchStats = async () => {
  try {
    const response = await fetch("/api/stats");
    const data = await response.json();
    return data.data as Stats;
  } catch (error) {
    console.error(error);
  }
};

export const useGetStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
};
