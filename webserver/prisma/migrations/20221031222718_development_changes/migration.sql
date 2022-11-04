/*
  Warnings:

  - You are about to drop the column `method` on the `Api` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Api_route_method_key";

-- AlterTable
ALTER TABLE "Api" DROP COLUMN "method";
