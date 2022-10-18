/*
  Warnings:

  - You are about to drop the column `first_name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "firstName" VARCHAR(280) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(280) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "firstName" VARCHAR(280) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(280) NOT NULL;

-- CreateTable
CREATE TABLE "Hardware" (
    "id" SERIAL NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "details" TEXT,

    CONSTRAINT "Hardware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HardwareOnClients" (
    "hardwareId" INTEGER NOT NULL,
    "clientAccountId" INTEGER NOT NULL,

    CONSTRAINT "HardwareOnClients_pkey" PRIMARY KEY ("hardwareId","clientAccountId")
);

-- AddForeignKey
ALTER TABLE "HardwareOnClients" ADD CONSTRAINT "HardwareOnClients_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "Hardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardwareOnClients" ADD CONSTRAINT "HardwareOnClients_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
