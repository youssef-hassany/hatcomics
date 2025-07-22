import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

const getTopUsers = async () => {
  try {
    const response = await fetch("/api/top-users");
    const data = await response.json();
    return data.data as User[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetTopUsers = () => {
  return useQuery({
    queryKey: ["top-users"],
    queryFn: getTopUsers,
  });
};
