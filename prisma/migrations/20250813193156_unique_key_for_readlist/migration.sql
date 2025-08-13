/*
  Warnings:

  - A unique constraint covering the columns `[userId,comicId]` on the table `Readlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Readlist_userId_comicId_key" ON "Readlist"("userId", "comicId");
