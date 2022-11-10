/*
  Warnings:

  - You are about to drop the column `action` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `entity` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the `ActionOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActionOnUsers" DROP CONSTRAINT "ActionOnUsers_actionId_fkey";

-- DropForeignKey
ALTER TABLE "ActionOnUsers" DROP CONSTRAINT "ActionOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "action",
DROP COLUMN "entity",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ActionOnUsers";

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
