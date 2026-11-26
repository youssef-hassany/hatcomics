/*
  Warnings:

  - A unique constraint covering the columns `[userId,comicId,releaseId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('issue', 'volume', 'tpb', 'omnibus', 'collection', 'book');

-- DropIndex
DROP INDEX "Review_userId_comicId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "releaseId" TEXT;

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "comicId" TEXT NOT NULL,
    "releaseType" "ReleaseType" NOT NULL,
    "title" TEXT NOT NULL,
    "issueNumber" INTEGER,
    "volumeNumber" INTEGER,
    "releaseDate" TIMESTAMP(3),
    "coverImage" TEXT,
    "description" TEXT,
    "pageCount" INTEGER,
    "averageRating" DOUBLE PRECISION,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Release_comicId_idx" ON "Release"("comicId");

-- CreateIndex
CREATE INDEX "Release_releaseType_idx" ON "Release"("releaseType");

-- CreateIndex
CREATE INDEX "Release_releaseDate_idx" ON "Release"("releaseDate");

-- CreateIndex
CREATE INDEX "Review_releaseId_idx" ON "Review"("releaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_comicId_releaseId_key" ON "Review"("userId", "comicId", "releaseId");

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
