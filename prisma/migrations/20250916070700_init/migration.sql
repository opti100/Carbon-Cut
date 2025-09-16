-- CreateEnum
CREATE TYPE "public"."DisclosureFormat" AS ENUM ('SECR', 'CSRD', 'SEC');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."pdf_reports" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "disclosureFormat" "public"."DisclosureFormat" NOT NULL,
    "isCertified" BOOLEAN NOT NULL DEFAULT false,
    "certificationId" TEXT,
    "certificationDate" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "cloudinaryPublicId" TEXT,
    "totalEmissions" DOUBLE PRECISION NOT NULL,
    "activityCount" INTEGER NOT NULL,
    "reportPeriod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentAmount" DOUBLE PRECISION,
    "paymentDate" TIMESTAMP(3),
    "stripePaymentId" TEXT,

    CONSTRAINT "pdf_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_activities" (
    "id" TEXT NOT NULL,
    "pdfReportId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "activityLabel" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "co2Emissions" DOUBLE PRECISION NOT NULL,
    "scope" INTEGER NOT NULL,
    "campaign" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pdf_reports_certificationId_key" ON "public"."pdf_reports"("certificationId");

-- AddForeignKey
ALTER TABLE "public"."report_activities" ADD CONSTRAINT "report_activities_pdfReportId_fkey" FOREIGN KEY ("pdfReportId") REFERENCES "public"."pdf_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
