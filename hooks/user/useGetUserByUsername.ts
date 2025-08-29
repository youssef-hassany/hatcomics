import { UserProfile } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

const fetchUserByUsername = async (username: string) => {
  try {
    const response = await fetch(`/api/user/${username}`);
    const data = await response.json();
    return data.data as UserProfile;
  } catch (error) {
    console.error(error);
  }
};

export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUserByUsername(username),
  });
};
