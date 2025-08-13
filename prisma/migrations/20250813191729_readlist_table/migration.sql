-- CreateTable
CREATE TABLE "Readlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Readlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Readlist" ADD CONSTRAINT "Readlist_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Readlist" ADD CONSTRAINT "Readlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
