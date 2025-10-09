/*
  Warnings:

  - You are about to drop the column `type` on the `Roadmap` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,listId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "listId" TEXT;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "listId" TEXT;

-- AlterTable
ALTER TABLE "Roadmap" DROP COLUMN "type";

-- DropEnum
DROP TYPE "ListType";

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListEntry" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "order" INTEGER,
    "notes" TEXT,
    "rating" INTEGER,
    "contentType" TEXT NOT NULL,
    "comicId" TEXT,
    "comicName" TEXT,
    "publisher" TEXT,
    "issueNumber" TEXT,
    "characterName" TEXT,
    "externalId" TEXT,
    "externalSource" TEXT,
    "image" TEXT,
    "description" TEXT,

    CONSTRAINT "ListEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "List_createdBy_idx" ON "List"("createdBy");

-- CreateIndex
CREATE INDEX "List_isPublic_idx" ON "List"("isPublic");

-- CreateIndex
CREATE INDEX "ListEntry_listId_idx" ON "ListEntry"("listId");

-- CreateIndex
CREATE INDEX "ListEntry_comicId_idx" ON "ListEntry"("comicId");

-- CreateIndex
CREATE INDEX "ListEntry_contentType_idx" ON "ListEntry"("contentType");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_listId_key" ON "Like"("userId", "listId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
