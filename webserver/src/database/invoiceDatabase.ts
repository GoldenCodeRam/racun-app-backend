import { Invoice, PrismaClient } from "@prisma/client";
import { InvoiceModel } from "../model/invoice";
import { withPrismaClient } from "./database";

export namespace InvoiceDatabase {
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

    export async function getInvoices() {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.invoice.findMany();
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
