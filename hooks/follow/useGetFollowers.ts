import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

const getFollowers = async (username: string) => {
  if (!username) return;

  try {
    const response = await fetch(`/api/user/${username}/followers`);
    const data = await response.json();
    return data.data.followers as User[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetFollowers = (username: string) => {
  return useQuery({
    queryKey: ["followers", username],
    queryFn: () => getFollowers(username),
  });
};
