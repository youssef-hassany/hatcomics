/*
  Warnings:

  - You are about to drop the column `characterName` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `comicId` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `comicName` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `externalSource` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `issueNumber` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `ListEntry` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `ListEntry` table. All the data in the column will be lost.
  - Added the required column `title` to the `ListEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ListEntry" DROP CONSTRAINT "ListEntry_comicId_fkey";

-- DropIndex
DROP INDEX "ListEntry_comicId_idx";

-- DropIndex
DROP INDEX "ListEntry_contentType_idx";

-- AlterTable
ALTER TABLE "ListEntry" DROP COLUMN "characterName",
DROP COLUMN "comicId",
DROP COLUMN "comicName",
DROP COLUMN "contentType",
DROP COLUMN "externalId",
DROP COLUMN "externalSource",
DROP COLUMN "issueNumber",
DROP COLUMN "notes",
DROP COLUMN "publisher",
DROP COLUMN "rating",
ADD COLUMN     "title" TEXT NOT NULL;
