import { useQuery } from "@tanstack/react-query";

const checkUsername = async (username: string) => {
  try {
    const response = await fetch(`/api/user/username-available/${username}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const useCheckUsername = (username: string) => {
  return useQuery({
    queryKey: ["username-availability", username],
    queryFn: () => checkUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
