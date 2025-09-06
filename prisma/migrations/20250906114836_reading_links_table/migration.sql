-- CreateTable
CREATE TABLE "ReadingLink" (
    "id" TEXT NOT NULL,
    "comicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "translatorName" TEXT NOT NULL,
    "langauage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingLink_comicId_key" ON "ReadingLink"("comicId");

-- AddForeignKey
ALTER TABLE "ReadingLink" ADD CONSTRAINT "ReadingLink_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
