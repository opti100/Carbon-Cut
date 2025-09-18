/*
  Warnings:

  - The `paymentStatus` column on the `pdf_reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `pdf_reports` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `disclosureFormat` on the `pdf_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."disclosure_format" AS ENUM ('SECR', 'CSRD', 'SEC');

-- CreateEnum
CREATE TYPE "public"."payment_status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."pdf_reports" ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "disclosureFormat",
ADD COLUMN     "disclosureFormat" "public"."disclosure_format" NOT NULL,
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "public"."payment_status" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."DisclosureFormat";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "otpCode" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."pdf_reports" ADD CONSTRAINT "pdf_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
