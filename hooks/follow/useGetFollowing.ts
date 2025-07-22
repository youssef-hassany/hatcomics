import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

const getFollowing = async (username: string) => {
  if (!username) return;

  try {
    const response = await fetch(`/api/user/${username}/following`);
    const data = await response.json();
    return data.data.following as User[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetFollowing = (username: string) => {
  return useQuery({
    queryKey: ["following", username],
    queryFn: () => getFollowing(username),
  });
};
