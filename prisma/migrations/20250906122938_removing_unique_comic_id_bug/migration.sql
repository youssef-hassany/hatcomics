/*
  Warnings:

  - You are about to drop the column `langauage` on the `ReadingLink` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReadingLink_comicId_key";

-- AlterTable
ALTER TABLE "ReadingLink" DROP COLUMN "langauage",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';
