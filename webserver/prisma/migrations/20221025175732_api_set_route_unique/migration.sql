/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `API` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "API_route_key" ON "API"("route");
