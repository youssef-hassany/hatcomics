import { prisma } from "@/lib/db";
import { NotificationType, EntityType, BroadcastType } from "@prisma/client";

export class NotificationService {
  // Individual notification methods
  async createLikeNotification(
    recipientId: string,
    actorId: string,
    entityType: EntityType,
    entityId: string,
    url: string
  ) {
    if (recipientId === actorId) return; // Don't notify yourself

    let type: NotificationType;
    switch (entityType) {
      case EntityType.POST:
        type = NotificationType.LIKE_POST;
        break;
      case EntityType.COMMENT:
        type = NotificationType.LIKE_COMMENT;
        break;
      case EntityType.REVIEW:
        type = NotificationType.LIKE_REVIEW;
        break;
      case EntityType.ROADMAP:
        type = NotificationType.LIKE_ROADMAP;
        break;
      default:
        type = NotificationType.LIKE_POST;
    }

    const batchKey = `${type.toLowerCase()}_${entityId}`;

    await this.createOrUpdateBatchedNotification({
      recipientId,
      actorId,
      type,
      entityType,
      entityId,
      batchKey,
      message: this.generateLikeMessage(entityType),
      url,
    });
  }

  async createCommentNotification(
    recipientId: string,
    actorId: string,
    entityType: EntityType,
    entityId: string,
    url: string
  ) {
    if (recipientId === actorId) return;

    let type: NotificationType;
    switch (entityType) {
      case EntityType.POST:
        type = NotificationType.COMMENT_POST;
        break;
      case EntityType.REVIEW:
        type = NotificationType.COMMENT_REVIEW;
        break;
      case EntityType.ROADMAP:
        type = NotificationType.COMMENT_ROADMAP;
        break;
      default:
        type = NotificationType.COMMENT_POST;
    }

    const batchKey = `comment_${entityType.toLowerCase()}_${entityId}`;

    await this.createOrUpdateBatchedNotification({
      recipientId,
      actorId,
      type,
      entityType,
      entityId,
      batchKey,
      message: `commented on your ${entityType.toLowerCase()}`,
      url: url,
    });
  }

  async createReplyNotification(
    recipientId: string,
    actorId: string,
    commentId: string,
    replyId: string,
    url: string
  ) {
    if (recipientId === actorId) return;

    // Don't batch replies - they're usually more personal
    await prisma.userNotification.create({
      data: {
        recipientId,
        actorId,
        type: NotificationType.REPLY_COMMENT,
        entityType: EntityType.COMMENT,
        entityId: replyId,
        message: "replied to your comment",
        url,
      },
    });
  }

  // Batched notification logic
  private async createOrUpdateBatchedNotification(data: {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    entityType: EntityType;
    entityId: string;
    batchKey: string;
    message: string;
    url?: string;
  }) {
    const BATCH_WINDOW_MINUTES = 60; // Group actions within 1 hour
    const cutoffTime = new Date(Date.now() - BATCH_WINDOW_MINUTES * 60 * 1000);

    // Try to find existing notification to batch with
    const existingNotification = await prisma.userNotification.findFirst({
      where: {
        recipientId: data.recipientId,
        batchKey: data.batchKey,
        createdAt: { gte: cutoffTime },
        readAt: null, // Only batch unread notifications
      },
      include: {
        actor: { select: { id: true, username: true } },
      },
    });

    if (existingNotification) {
      // Update existing notification with new count and actor
      const newCount = existingNotification.batchCount + 1;
      const message = this.generateBatchedMessage(
        data.type,
        data.entityType,
        newCount,
        data.actorId === existingNotification.actorId
      );

      await prisma.userNotification.update({
        where: { id: existingNotification.id },
        data: {
          actorId: data.actorId, // Most recent actor becomes primary
          batchCount: newCount,
          lastBatchedAt: new Date(),
          message,
        },
      });
    } else {
      // Create new notification
      await prisma.userNotification.create({
        data: {
          recipientId: data.recipientId,
          actorId: data.actorId,
          type: data.type,
          entityType: data.entityType,
          entityId: data.entityId,
          batchKey: data.batchKey,
          message: data.message,
          url: data.url,
        },
      });
    }
  }

  // Broadcast notification methods
  async notifyFollowersOfNewPost(
    authorId: string,
    postId: string,
    url: string
  ) {
    await prisma.broadcastNotification.create({
      data: {
        title: "New post from someone you follow",
        content: `Check out the latest post!`,
        type: BroadcastType.FOLLOWER_POST,
        targetCriteria: {
          type: "followers",
          userId: authorId,
          entityId: postId,
        },
        url: url ? url : `/posts/${postId}`,
      },
    });
  }

  async notifyFollowersOfNewRoadmap(
    authorId: string,
    roadmapId: string,
    url: string
  ) {
    await prisma.broadcastNotification.create({
      data: {
        title: "New roadmap from someone you follow",
        content: `Check out the latest roadmap!`,
        type: BroadcastType.FOLLOWER_ROADMAP,
        targetCriteria: {
          type: "followers",
          userId: authorId,
          entityId: roadmapId,
        },
        url: url ? url : `/roadmaps/${roadmapId}`,
      },
    });
  }

  async createAdminAnnouncement(title: string, content: string, url: string) {
    await prisma.broadcastNotification.create({
      data: {
        title,
        content,
        type: BroadcastType.ADMIN_ANNOUNCEMENT,
        targetCriteria: { type: "all" },
        url,
      },
    });
  }

  // Get user notifications with batching info
  async getUserNotifications(userId: string, limit: number = 20) {
    console.log(limit);

    const individualNotifications = await prisma.userNotification.findMany({
      where: { recipientId: userId },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            photo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      // take: limit,
    });

    // Get broadcast notifications the user should see
    const allBroadcasts = await prisma.broadcastNotification.findMany({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        reads: {
          where: { userId },
        },
      },
      orderBy: { createdAt: "desc" },
      // take: limit,
    });

    // Filter broadcasts based on target criteria
    const userFollowingIds = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingSet = new Set(userFollowingIds.map((f) => f.followingId));

    const relevantBroadcasts = allBroadcasts.filter((broadcast) => {
      const criteria = broadcast.targetCriteria as any;

      if (criteria.type === "all") return true;

      if (criteria.type === "followers" && criteria.userId) {
        return followingSet.has(criteria.userId);
      }

      return false;
    });

    return {
      individual: individualNotifications.map(
        this.formatIndividualNotification
      ),
      broadcast: relevantBroadcasts.map((b) => ({
        ...b,
        isRead: b.reads.length > 0,
      })),
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    const individualCount = await prisma.userNotification.count({
      where: {
        recipientId: userId,
        readAt: null,
      },
    });

    // Count unread broadcasts
    const allBroadcasts = await prisma.broadcastNotification.findMany({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        reads: {
          where: { userId },
        },
      },
    });

    const userFollowingIds = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingSet = new Set(userFollowingIds.map((f) => f.followingId));

    const unreadBroadcasts = allBroadcasts.filter((broadcast) => {
      if (broadcast.reads.length > 0) return false;

      const criteria = broadcast.targetCriteria as any;
      if (criteria.type === "all") return true;
      if (criteria.type === "followers" && criteria.userId) {
        return followingSet.has(criteria.userId);
      }
      return false;
    }).length;

    return individualCount + unreadBroadcasts;
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    await prisma.userNotification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId,
      },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await prisma.userNotification.updateMany({
      where: {
        recipientId: userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }

  async markBroadcastAsRead(userId: string, broadcastId: string) {
    await prisma.userBroadcastRead.upsert({
      where: {
        userId_broadcastNotificationId: {
          userId,
          broadcastNotificationId: broadcastId,
        },
      },
      create: {
        userId,
        broadcastNotificationId: broadcastId,
      },
      update: {
        readAt: new Date(),
      },
    });
  }

  // Helper methods
  private generateLikeMessage(entityType: EntityType): string {
    switch (entityType) {
      case EntityType.POST:
        return "liked your post";
      case EntityType.COMMENT:
        return "liked your comment";
      case EntityType.REVIEW:
        return "liked your review";
      case EntityType.ROADMAP:
        return "liked your roadmap";
      default:
        return "liked your content";
    }
  }

  private generateBatchedMessage(
    type: NotificationType,
    entityType: EntityType,
    count: number,
    sameActor: boolean
  ): string {
    const entityName = entityType.toLowerCase();

    if (count === 2) {
      return sameActor
        ? `liked your ${entityName} again`
        : `and 1 other liked your ${entityName}`;
    }

    return sameActor
      ? `liked your ${entityName} ${count} times`
      : `and ${count - 1} others liked your ${entityName}`;
  }

  private formatIndividualNotification(notification: any) {
    return {
      id: notification.id,
      type: notification.type,
      entityType: notification.entityType,
      entityId: notification.entityId,
      message: notification.message,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      actor: notification.actor,
      batchCount: notification.batchCount,
      isRead: !!notification.readAt,
      url: notification.url,
    };
  }

  // Background job to clean up old notifications
  async cleanupOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    await prisma.userNotification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        readAt: { not: null },
      },
    });
  }
}

export const notificationService = new NotificationService();
