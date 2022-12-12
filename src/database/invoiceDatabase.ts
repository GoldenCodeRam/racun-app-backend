import {
    Client,
    ClientAccount,
    ClientContract,
    Invoice,
    PrismaClient,
    Service,
} from "@prisma/client";
import { DateTime } from "luxon";
import { Err, Ok, Result } from "ts-results";
import { InvoiceModel } from "../model/invoice";
import { ConfigDatabase } from "./configDatabase";
import { ContractDatabase } from "./contractDatabase";
import { withPrismaClient } from "./database";

export namespace InvoiceDatabase {
    export async function findOne(id: number) {
        return await withPrismaClient<Result<Invoice, Error>>(
            async (prisma: PrismaClient) => {
                const result = await prisma.invoice.findUnique({
                    where: {
                        id,
                    },
                });

                if (result) {
                    return Ok(result);
                } else {
                    return Err(new Error());
                }
            }
        );
    }

    export async function generateInvoices() {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            // Select only the current contracts.
            const contracts = await prisma.clientContract.findMany({
                where: {
                    dateEnd: null,
                },
            });

            for (const contract of contracts) {
                // We measure the amount of the late payments if there is any
                const pendingInvoices = await prisma.invoice.findMany({
                    where: {
                        contractId: contract.id,
                        status: InvoiceModel.InvoiceStatus.PENDING,
                    },
                });
                for (const invoice of pendingInvoices) {
                    if (invoice.status === InvoiceModel.InvoiceStatus.PENDING) {
                        invoice.status = InvoiceModel.InvoiceStatus.LATE;

                        await InvoiceDatabase.updateInvoice(
                            invoice.id,
                            invoice
                        );

                        contract.currentDebt += invoice.value;
                        await ContractDatabase.updateContract(
                            contract.id,
                            contract
                        );
                    }
                }

                const nextPaymentDate =
                    await ConfigDatabase.getInvoiceGenerationDate();
                if (nextPaymentDate.ok) {
                    await prisma.invoice.create({
                        data: {
                            generationDate: new Date(),
                            periodStart: DateTime.now()
                                .minus({
                                    months: 1,
                                })
                                .toJSDate(),
                            periodEnd: new Date(),
                            paymentDate: new Date(nextPaymentDate.val.value),
                            suspensionDate: new Date(nextPaymentDate.val.value),
                            value: contract.value,
                            latePaymentValue: contract.currentDebt,
                            adjustment: 0,
                            status: InvoiceModel.InvoiceStatus.PENDING,
                            contractId: contract.id,
                        },
                    });
                }
            }
        });
    }

    export async function deleteInvoice(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.invoice.delete({
                where: {
                    id,
                },
            });
        });
    }

    export async function updateInvoice(
        id: number,
        changes: InvoiceModel.InvoiceData
    ) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.invoice.update({
                where: {
                    id,
                },
                data: changes,
            });
        });
    }

    export async function getInvoiceById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.invoice.findUnique({
                where: {
                    id,
                },
            });
        });
    }

    export async function getInvoices(): Promise<
        Result<
            (Invoice & {
                contract: ClientContract & {
                    service: Service;
                    clientAccount: ClientAccount & {
                        client: Client;
                    };
                };
            })[],
            Error
        >
    > {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            try {
                return Ok(
                    await prisma.invoice.findMany({
                        include: {
                            contract: {
                                include: {
                                    service: true,
                                    clientAccount: {
                                        include: {
                                            client: true,
                                        },
                                    },
                                },
                            },
                        },
                        where: {
                            status: InvoiceModel.InvoiceStatus.PENDING,
                        },
                    })
                );
            } catch (error: any) {
                return Err(error);
            }
        });
    }

    export async function createInvoice(invoiceData: InvoiceModel.InvoiceData) {
        return await withPrismaClient<Invoice | null>(
            async (prisma: PrismaClient) => {
                const invoice = await prisma.invoice.create({
                    data: {
                        ...invoiceData,
                    },
                });

                return invoice;
            }
        );
    }
}
