-- DropForeignKey
ALTER TABLE "ClientAccount" DROP CONSTRAINT "ClientAccount_clientId_fkey";

-- AddForeignKey
ALTER TABLE "ClientAccount" ADD CONSTRAINT "ClientAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
