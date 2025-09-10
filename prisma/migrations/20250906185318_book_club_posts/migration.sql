-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "comicId" TEXT,
ADD COLUMN     "hasSpoiler" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Post_comicId_idx" ON "Post"("comicId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_hasSpoiler_idx" ON "Post"("hasSpoiler");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
