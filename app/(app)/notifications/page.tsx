"use client";

import { useState, useCallback, useMemo } from "react";
import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useReadAllNotification } from "@/hooks/notifications/usereadAllNotifications";
import NotificationsSkeleton from "@/components/notifications/NotificationsSkeleton";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationList from "@/components/notifications/NotificationList";

type FilterType = "all" | "activity" | "announcement";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  // Fetch notifications using the hook
  const { data: notificationsData, isLoading, error } = useGetNotifications();

  // Mutation hooks for marking as read
  const readAllNotificationMutation = useReadAllNotification();

  // Memoize combined notifications
  const allNotifications = useMemo(() => {
    return [
      ...(notificationsData?.individual || []).map((n) => ({
        ...n,
        notifType: "activity" as const,
      })),
      ...(notificationsData?.broadcast || []).map((n) => ({
        ...n,
        notifType: "announcement" as const,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notificationsData]);

  // Memoize filtered notifications
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n) => {
      if (filter === "all") return true;
      return n.notifType === filter;
    });
  }, [allNotifications, filter]);

  // Memoize unread count
  const unreadCount = useMemo(() => {
    return allNotifications.filter((n) => !n.isRead).length;
  }, [allNotifications]);

  const handleMarkAllAsRead = useCallback(() => {
    const unreadIndividual =
      notificationsData?.individual.filter((n) => !n.isRead) || [];
    const unreadBroadcast =
      notificationsData?.broadcast.filter((n) => !n.isRead) || [];

    [...unreadIndividual, ...unreadBroadcast].forEach((notification) => {
      readAllNotificationMutation.mutate(notification.id);
    });
  }, [notificationsData, readAllNotificationMutation]);

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading notifications</p>
          <p className="text-zinc-400 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <NotificationHeader />

        <NotificationFilters
          filter={filter}
          onFilterChange={setFilter}
          totalCount={allNotifications.length}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          isMarkingAllAsRead={readAllNotificationMutation.isPending}
        />

        <NotificationList notifications={filteredNotifications} />
      </div>
    </div>
  );
}
