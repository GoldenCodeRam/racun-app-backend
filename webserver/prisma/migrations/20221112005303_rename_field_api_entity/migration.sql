/*
  Warnings:

  - You are about to drop the column `route` on the `Api` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Api` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Api` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Api_route_key";

-- AlterTable
ALTER TABLE "Api" DROP COLUMN "route",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Api_name_key" ON "Api"("name");
