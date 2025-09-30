import { useQuery } from "@tanstack/react-query";

const getNotificationsCount = async () => {
  try {
    const response = await fetch("/api/notifications/count");
    if (!response.ok) {
      throw new Error("Error loading notifications count");
    }

    const data = await response.json();
    return data.data as number;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetNotificationsCount = () => {
  return useQuery({
    queryKey: ["notifications-count"],
    queryFn: getNotificationsCount,
  });
};
