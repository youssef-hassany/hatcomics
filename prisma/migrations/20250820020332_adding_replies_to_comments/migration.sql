-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "replyTo" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
