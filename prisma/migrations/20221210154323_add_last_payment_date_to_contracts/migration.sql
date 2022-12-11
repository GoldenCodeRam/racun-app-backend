/*
  Warnings:

  - Added the required column `lastPayment` to the `ClientContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientContract" ADD COLUMN     "lastPayment" TIMESTAMP(3) NOT NULL;
