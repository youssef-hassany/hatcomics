import { User } from "@/types/User";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

const fetchCurrentUser = async () => {
  try {
    const response = await fetch("/api/user/me");
    const data = await response.json();
    return data.user as User;
  } catch (error) {
    console.error(error);
  }
};

export const useGetLoggedInUser = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    enabled: !!userId,
  });
};
