import { memo } from "react";
import { Heart, MessageCircle, Reply, Bell, Megaphone } from "lucide-react";
import { getTimeAgo } from "@/lib/date";
import type {
  IndividualNotification,
  BroadcastNotification,
} from "@/types/Notification";
import { useRouter } from "next/navigation";
import { useReadNotification } from "@/hooks/notifications/useReadNotification";

type NotificationItemProps = {
  notification: (IndividualNotification | BroadcastNotification) & {
    notifType: "activity" | "announcement";
  };
};

const getActionIcon = (type: string) => {
  if (type.includes("like") || type.includes("LIKE")) {
    return <Heart className="w-4 h-4" />;
  }
  if (type.includes("comment") || type.includes("COMMENT")) {
    return <MessageCircle className="w-4 h-4" />;
  }
  if (type.includes("reply") || type.includes("REPLY")) {
    return <Reply className="w-4 h-4" />;
  }
  return <Bell className="w-4 h-4" />;
};

function NotificationItem({ notification }: NotificationItemProps) {
  const isIndividual = "actor" in notification;

  const router = useRouter();
  const { mutateAsync: readNotification } = useReadNotification();

  const handleMarkAsRead = async () => {
    router.push(notification.url);
    await readNotification({
      notificationId: notification.id,
      notificationType:
        notification.notifType === "activity" ? "user" : "broadcast",
    });
  };

  return (
    <div
      onClick={handleMarkAsRead}
      className={`p-4 rounded-lg border transition-all hover:border-zinc-700 cursor-pointer ${
        notification.isRead
          ? "bg-zinc-900/50 border-zinc-800"
          : "bg-zinc-900 border-orange-900/50"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isIndividual
              ? "bg-orange-600/20 text-orange-500"
              : (notification as BroadcastNotification).type === "SYSTEM"
              ? "bg-orange-600 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {isIndividual ? (
            (notification as IndividualNotification).actor.photo ? (
              <img
                src={(notification as IndividualNotification).actor.photo || ""}
                alt={(notification as IndividualNotification).actor.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getActionIcon((notification as IndividualNotification).type)
            )
          ) : (notification as BroadcastNotification).type === "SYSTEM" ? (
            <Megaphone className="w-4 h-4" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isIndividual ? (
            <div>
              <p className="text-zinc-200">
                <span className="font-semibold">
                  {(notification as IndividualNotification).actor.username}
                </span>
                {(notification as IndividualNotification).batchCount > 1 && (
                  <span className="text-zinc-400">
                    {" "}
                    and{" "}
                    {(notification as IndividualNotification).batchCount -
                      1}{" "}
                    others
                  </span>
                )}{" "}
                <span className="text-zinc-400">
                  {(notification as IndividualNotification).message}
                </span>
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {getTimeAgo(notification.createdAt)}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                {(notification as BroadcastNotification).type === "SYSTEM" && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-600 text-white">
                    ADMIN
                  </span>
                )}
                <p className="font-semibold text-zinc-200">
                  {(notification as BroadcastNotification).title}
                </p>
              </div>
              <p className="text-zinc-400 text-sm">
                {(notification as BroadcastNotification).content}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {getTimeAgo(notification.createdAt)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-start gap-2"></div>
      </div>
    </div>
  );
}

export default memo(NotificationItem);
