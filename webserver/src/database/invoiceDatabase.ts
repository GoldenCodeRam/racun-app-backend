import { Invoice, PrismaClient } from "@prisma/client";
import { InvoiceModel } from "../model/invoice";
import { withPrismaClient } from "./database";

export namespace InvoiceDatabase {
    export async function createInvoice(invoiceData: InvoiceModel.InvoiceData) {
        return await withPrismaClient<Invoice | null>(
            async (prisma: PrismaClient) => {
                const invoice = await prisma.invoice.create({
                    data: {
                        ...invoiceData
                    },
                });

                return invoice;
            }
        );
    }
}
