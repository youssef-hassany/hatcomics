-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'admin', 'content_creator', 'translator', 'seller', 'user');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ALTER COLUMN "bio" SET DEFAULT 'Your friendly neighborhood user';

-- CreateTable
CREATE TABLE "Comic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "authors" TEXT[],
    "characters" TEXT[],
    "numberOfIssues" INTEGER NOT NULL,
    "image" TEXT,
    "isBeginnerFriendly" BOOLEAN NOT NULL DEFAULT false,
    "readingLinks" TEXT[],
    "addedById" TEXT NOT NULL,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comicId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comic_publisher_idx" ON "Comic"("publisher");

-- CreateIndex
CREATE INDEX "Comic_isBeginnerFriendly_idx" ON "Comic"("isBeginnerFriendly");

-- CreateIndex
CREATE INDEX "Comic_averageRating_idx" ON "Comic"("averageRating");

-- CreateIndex
CREATE INDEX "Review_comicId_idx" ON "Review"("comicId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_comicId_key" ON "Review"("userId", "comicId");

-- AddForeignKey
ALTER TABLE "Comic" ADD CONSTRAINT "Comic_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
