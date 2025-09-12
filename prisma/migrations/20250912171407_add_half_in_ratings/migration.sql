-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('post', 'draft', 'thought');

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;
