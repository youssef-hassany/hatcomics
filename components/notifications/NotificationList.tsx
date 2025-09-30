import { memo } from "react";
import { Bell } from "lucide-react";
import type {
  IndividualNotification,
  BroadcastNotification,
} from "@/types/Notification";
import NotificationItem from "./NotificationItem";

type NotificationListProps = {
  notifications: Array<
    (IndividualNotification | BroadcastNotification) & {
      notifType: "activity" | "announcement";
    }
  >;
};

function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
        <p className="text-zinc-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

export default memo(NotificationList);
