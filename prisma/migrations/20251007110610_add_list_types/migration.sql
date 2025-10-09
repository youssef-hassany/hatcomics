-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('flat', 'numbered');

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "type" "ListType" NOT NULL DEFAULT 'flat';
