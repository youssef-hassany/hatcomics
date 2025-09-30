-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE_POST', 'LIKE_COMMENT', 'LIKE_REVIEW', 'LIKE_ROADMAP', 'COMMENT_POST', 'COMMENT_REVIEW', 'COMMENT_ROADMAP', 'REPLY_COMMENT');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('POST', 'COMMENT', 'REVIEW', 'ROADMAP');

-- CreateEnum
CREATE TYPE "BroadcastType" AS ENUM ('FOLLOWER_POST', 'ADMIN_ANNOUNCEMENT', 'SYSTEM_UPDATE');

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "message" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchKey" TEXT,
    "batchCount" INTEGER NOT NULL DEFAULT 1,
    "lastBatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broadcast_notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "BroadcastType" NOT NULL,
    "targetCriteria" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "broadcast_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_broadcast_reads" (
    "userId" TEXT NOT NULL,
    "broadcastNotificationId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_broadcast_reads_pkey" PRIMARY KEY ("userId","broadcastNotificationId")
);

-- CreateIndex
CREATE INDEX "user_notifications_recipientId_createdAt_idx" ON "user_notifications"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "user_notifications_batchKey_idx" ON "user_notifications"("batchKey");

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_broadcast_reads" ADD CONSTRAINT "user_broadcast_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_broadcast_reads" ADD CONSTRAINT "user_broadcast_reads_broadcastNotificationId_fkey" FOREIGN KEY ("broadcastNotificationId") REFERENCES "broadcast_notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
