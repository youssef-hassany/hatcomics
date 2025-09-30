import { NotificationsData } from "@/types/Notification";
import { useQuery } from "@tanstack/react-query";

const getNotifications = async () => {
  try {
    const response = await fetch("/api/notifications");
    if (!response.ok) {
      throw new Error("Error loading notifications");
    }

    const data = await response.json();
    return data.data as NotificationsData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 5 * 60 * 1000,
  });
};
