import { useMutation, useQueryClient } from "@tanstack/react-query";

const readAllNotification = async (notificationId: string | undefined) => {
  if (!notificationId) return;

  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Error loading notifications");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useReadAllNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["read-all-notification"],
    mutationFn: readAllNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
};
