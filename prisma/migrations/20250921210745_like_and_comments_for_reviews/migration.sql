/*
  Warnings:

  - A unique constraint covering the columns `[userId,reviewId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_commentId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "reviewId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "reviewId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_reviewId_key" ON "Like"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
