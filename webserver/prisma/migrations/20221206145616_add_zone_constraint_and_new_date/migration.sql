/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Zone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `startDate` to the `HardwareOnZones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HardwareOnZones" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Zone_code_key" ON "Zone"("code");
