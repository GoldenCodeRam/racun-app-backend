/*
  Warnings:

  - Added the required column `currentDebt` to the `ClientContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latePaymentValue` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientContract" ADD COLUMN     "currentDebt" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "latePaymentValue" DOUBLE PRECISION NOT NULL;
