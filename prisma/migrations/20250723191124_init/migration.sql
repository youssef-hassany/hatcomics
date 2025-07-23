/*
  Warnings:

  - You are about to drop the column `addedById` on the `Comic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comic" DROP CONSTRAINT "Comic_addedById_fkey";

-- AlterTable
ALTER TABLE "Comic" DROP COLUMN "addedById";
