-- AlterTable
ALTER TABLE "broadcast_notifications" ADD COLUMN     "url" TEXT NOT NULL DEFAULT '/';

-- AlterTable
ALTER TABLE "user_notifications" ADD COLUMN     "url" TEXT NOT NULL DEFAULT '/';
