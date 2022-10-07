import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

export async function withPrismaClient(callback: (prisma: PrismaClient) => Promise<void>): Promise<void> {
    prisma.$connect();
    await callback(prisma);
    prisma.$disconnect();
}
