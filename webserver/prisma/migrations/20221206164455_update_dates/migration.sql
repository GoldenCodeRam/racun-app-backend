/*
  Warnings:

  - Added the required column `startDate` to the `HardwareOnClients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HardwareOnClients" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HardwareOnZones" ADD COLUMN     "endDate" TIMESTAMP(3);
