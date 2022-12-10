/*
  Warnings:

  - The primary key for the `HardwareOnClients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HardwareOnZones` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "HardwareOnClients" DROP CONSTRAINT "HardwareOnClients_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "HardwareOnClients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HardwareOnZones" DROP CONSTRAINT "HardwareOnZones_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "HardwareOnZones_pkey" PRIMARY KEY ("id");
