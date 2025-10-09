-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('roadmap', 'list', 'tier_list');

-- AlterTable
ALTER TABLE "Roadmap" ADD COLUMN     "type" "ListType" NOT NULL DEFAULT 'roadmap';
