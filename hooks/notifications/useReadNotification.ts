import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  notificationId: string | undefined;
  notificationType: "user" | "broadcast";
}

const readNotification = async (params: Params) => {
  const { notificationId, notificationType } = params;

  if (!notificationId) return;

  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "PATCH",
      body: JSON.stringify({ notificationType }),
    });
    if (!response.ok) {
      throw new Error("Error loading notifications");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["read-notification"],
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
};
