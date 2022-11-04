/*
  Warnings:

  - You are about to drop the `API` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `APIsOnRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "APIsOnRoles" DROP CONSTRAINT "APIsOnRoles_apiId_fkey";

-- DropForeignKey
ALTER TABLE "APIsOnRoles" DROP CONSTRAINT "APIsOnRoles_roleId_fkey";

-- DropTable
DROP TABLE "API";

-- DropTable
DROP TABLE "APIsOnRoles";

-- CreateTable
CREATE TABLE "Api" (
    "id" SERIAL NOT NULL,
    "route" TEXT NOT NULL,
    "method" INTEGER NOT NULL,

    CONSTRAINT "Api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApisOnRoles" (
    "apiId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "get" BOOLEAN NOT NULL DEFAULT false,
    "post" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ApisOnRoles_pkey" PRIMARY KEY ("apiId","roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Api_route_key" ON "Api"("route");

-- CreateIndex
CREATE UNIQUE INDEX "Api_method_key" ON "Api"("method");

-- AddForeignKey
ALTER TABLE "ApisOnRoles" ADD CONSTRAINT "ApisOnRoles_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApisOnRoles" ADD CONSTRAINT "ApisOnRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
