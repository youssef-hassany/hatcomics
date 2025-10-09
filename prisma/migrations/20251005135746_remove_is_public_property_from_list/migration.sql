/*
  Warnings:

  - You are about to drop the column `isPublic` on the `List` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "List_isPublic_idx";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "isPublic";
