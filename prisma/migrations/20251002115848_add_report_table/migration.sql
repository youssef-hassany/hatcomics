-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "referenceUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
