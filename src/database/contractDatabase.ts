import { ClientContract, PrismaClient } from "@prisma/client";
import { Err, Ok, Result } from "ts-results";
import { InvoiceModel } from "../model/invoice";
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
        currentDebt: number;
        clientAccountId: number;
        placeId: number;
        serviceId: number;
    }): Promise<Result<ClientContract, Error>> {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            try {
                if (
                    await canCreateContract(
                        prisma,
                        clientInformation.clientAccountId
                    )
                ) {
                    const clientContract = await prisma.clientContract.create({
                        data: clientInformation,
                    });
                    if (clientContract) {
                        return Ok(clientContract);
                    }
                }
                return Err(new Error());
            } catch (error: any) {
                return Err(error);
            }
        });
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

    export async function getContractByClientAccount(
        id: number
    ): Promise<Result<ClientContract, Error>> {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            try {
                const clientContract = await prisma.clientContract.findFirst({
                    where: {
                        clientAccountId: id,
                        dateEnd: null,
                    },
                    include: {
                        invoices: {
                            where: {
                                status: InvoiceModel.InvoiceStatus.PENDING,
                            },
                        },
                    },
                });

                if (clientContract) {
                    return Ok(clientContract);
                } else {
                    return Err(new Error());
                }
            } catch (error: any) {
                return Err(error);
            }
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

    export async function terminateContract(
        id: number
    ): Promise<Result<ClientContract, Error>> {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            if (await canTerminateContract(prisma, id)) {
                const result = await prisma.clientContract.update({
                    where: {
                        id,
                    },
                    data: {
                        dateEnd: new Date(),
                    },
                });

                return Ok(result);
            } else {
                return Err(new Error());
            }
        });
    }

    export async function makeInvoicePayment(
        invoiceData: InvoiceModel.InvoiceData
    ) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.clientContract.update({
                where: {
                    id: invoiceData.contractId,
                },
                data: {
                    // Just update this, but we should do something else.
                    currentDebt: 0,
                },
            });
        });
    }

    async function canTerminateContract(prisma: PrismaClient, id: number) {
        try {
            const result = await prisma.invoice.findMany({
                where: {
                    contractId: id,
                    status: InvoiceModel.InvoiceStatus.PENDING,
                },
            });

            // This means there are pending invoices, so the contract can't be
            // terminated.
            return result.length === 0;
        } catch (error) {
            return false;
        }
    }

    async function canCreateContract(
        prisma: PrismaClient,
        clientAccountId: number
    ) {
        try {
            // This means there is a contract not finished, the only way we can
            // create a contract is if every other contract has finished.
            const result = await prisma.clientContract.findFirst({
                where: {
                    clientAccountId: clientAccountId,
                    dateEnd: null,
                },
            });
            return !result;
        } catch (error) {
            return false;
        }
    }
}
