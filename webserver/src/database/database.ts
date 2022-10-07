import { PrismaClient } from "@prisma/client";

export async function withPrismaClient(callback: (prisma: PrismaClient) => Promise<void>): Promise<void> {
    const prisma = new PrismaClient();
    await callback(prisma);
    prisma.$disconnect();
}
