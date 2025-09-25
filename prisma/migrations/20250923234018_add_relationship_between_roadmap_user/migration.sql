-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
