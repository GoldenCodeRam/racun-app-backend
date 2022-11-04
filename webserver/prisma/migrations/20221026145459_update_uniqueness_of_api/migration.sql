/*
  Warnings:

  - A unique constraint covering the columns `[route,method]` on the table `Api` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Api_method_key";

-- DropIndex
DROP INDEX "Api_route_key";

-- CreateIndex
CREATE UNIQUE INDEX "Api_route_method_key" ON "Api"("route", "method");
