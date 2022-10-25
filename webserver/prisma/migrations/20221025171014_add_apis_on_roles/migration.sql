/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermissionOnRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PermissionOnRoles" DROP CONSTRAINT "PermissionOnRoles_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionOnRoles" DROP CONSTRAINT "PermissionOnRoles_roleId_fkey";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "PermissionOnRoles";

-- CreateTable
CREATE TABLE "API" (
    "id" SERIAL NOT NULL,
    "route" TEXT NOT NULL,

    CONSTRAINT "API_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APIsOnRoles" (
    "apiId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "get" BOOLEAN NOT NULL DEFAULT false,
    "post" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "APIsOnRoles_pkey" PRIMARY KEY ("apiId","roleId")
);

-- AddForeignKey
ALTER TABLE "APIsOnRoles" ADD CONSTRAINT "APIsOnRoles_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "API"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APIsOnRoles" ADD CONSTRAINT "APIsOnRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
