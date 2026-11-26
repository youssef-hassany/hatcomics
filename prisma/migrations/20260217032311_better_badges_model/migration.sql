/*
  Warnings:

  - You are about to drop the column `title` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Badge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,badgeDefId]` on the table `Badge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `badgeDefId` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Badge_userId_url_key";

-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "title",
DROP COLUMN "url",
ADD COLUMN     "badgeDefId" TEXT NOT NULL,
ADD COLUMN     "isApplied" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BadgeDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "BadgeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeDefinition_name_key" ON "BadgeDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_userId_badgeDefId_key" ON "Badge"("userId", "badgeDefId");

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_badgeDefId_fkey" FOREIGN KEY ("badgeDefId") REFERENCES "BadgeDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
