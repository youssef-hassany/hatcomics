/*
  Warnings:

  - You are about to drop the `RoadmapComic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comicName` to the `RoadmapEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoadmapComic" DROP CONSTRAINT "RoadmapComic_comicId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapComic" DROP CONSTRAINT "RoadmapComic_entryId_fkey";

-- AlterTable
ALTER TABLE "RoadmapEntry" ADD COLUMN     "comicDescription" TEXT,
ADD COLUMN     "comicId" TEXT,
ADD COLUMN     "comicName" TEXT NOT NULL,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalSource" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "issueNumber" TEXT,
ADD COLUMN     "publisher" TEXT;

-- DropTable
DROP TABLE "RoadmapComic";

-- CreateIndex
CREATE INDEX "RoadmapEntry_comicId_idx" ON "RoadmapEntry"("comicId");

-- AddForeignKey
ALTER TABLE "RoadmapEntry" ADD CONSTRAINT "RoadmapEntry_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
