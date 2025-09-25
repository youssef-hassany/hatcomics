-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapEntry" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "RoadmapEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapComic" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "comicId" TEXT,
    "externalId" TEXT,
    "externalSource" TEXT,
    "name" TEXT NOT NULL,
    "publisher" TEXT,
    "image" TEXT,
    "issueNumber" TEXT,
    "description" TEXT,

    CONSTRAINT "RoadmapComic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Roadmap_createdBy_idx" ON "Roadmap"("createdBy");

-- CreateIndex
CREATE INDEX "Roadmap_isPublic_idx" ON "Roadmap"("isPublic");

-- CreateIndex
CREATE INDEX "RoadmapEntry_roadmapId_idx" ON "RoadmapEntry"("roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapEntry_roadmapId_order_key" ON "RoadmapEntry"("roadmapId", "order");

-- CreateIndex
CREATE INDEX "RoadmapComic_entryId_idx" ON "RoadmapComic"("entryId");

-- CreateIndex
CREATE INDEX "RoadmapComic_comicId_idx" ON "RoadmapComic"("comicId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapComic_entryId_order_key" ON "RoadmapComic"("entryId", "order");

-- AddForeignKey
ALTER TABLE "RoadmapEntry" ADD CONSTRAINT "RoadmapEntry_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapComic" ADD CONSTRAINT "RoadmapComic_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "RoadmapEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapComic" ADD CONSTRAINT "RoadmapComic_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
