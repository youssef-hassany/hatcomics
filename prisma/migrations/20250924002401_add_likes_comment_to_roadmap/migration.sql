/*
  Warnings:

  - A unique constraint covering the columns `[userId,roadmapId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "roadmapId" TEXT;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "roadmapId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_roadmapId_key" ON "Like"("userId", "roadmapId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
