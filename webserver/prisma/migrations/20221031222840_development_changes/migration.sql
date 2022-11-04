/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `Api` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Api_route_key" ON "Api"("route");
