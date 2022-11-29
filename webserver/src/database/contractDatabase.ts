import { ClientContract, PrismaClient } from "@prisma/client";
import { withPrismaClient } from "./database";

export namespace ContractDatabase {
    export async function deleteContract(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.clientContract.delete({
                where: {
                    id,
                },
            });
        });
    }

    export async function updateContract(id: number, changes: ClientContract) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.clientContract.update({
                where: {
                    id,
                },
                data: changes,
            });
        });
    }

    export async function getContracts() {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.clientContract.findMany();
        });
    }

    export async function createContract(clientInformation: {
        value: number;
        status: boolean;
        dateStart: Date;
        dateEnd?: Date;
        clientAccountId: number;
        placeId: number;
        serviceId: number;
    }) {
        return await withPrismaClient<ClientContract | null>(
            async (prisma: PrismaClient) => {
                const clientContract = await prisma.clientContract.create({
                    data: clientInformation,
                });

                return clientContract ?? null;
            }
        );
    }

    export async function getContractById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            const clientContract = await prisma.clientContract.findUnique({
                where: {
                    id,
                },
                include: {
                    clientAccount: {
                        include: {
                            client: true,
                        },
                    },
                    service: true,
                    place: true,
                },
            });

            return clientContract;
        });
    }

    export async function getContractsByClientAccount(clientAccountId: number) {
        return await withPrismaClient<ClientContract[] | null>(
            async (prisma: PrismaClient) => {
                const clientAccount = await prisma.clientAccount.findUnique({
                    where: {
                        id: clientAccountId,
                    },
                    include: {
                        clientContracts: true,
                    },
                });

                return clientAccount!.clientContracts ?? null;
            }
        );
    }
}
