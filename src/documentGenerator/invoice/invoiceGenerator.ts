import pdfmake from "pdfmake";
import { generateRemovableSection } from "./removable";
import { fonts } from "../utils/resources";
import { generateHeader } from "./header";
import { generateContentTable } from "./content";

import { Client, Invoice, Service } from "@prisma/client";

export function generateInvoice(
    invoiceInformation: {
        generationDate: Date;
        invoice: Invoice;
        client: Client;
        services: Service[];
        qrCode: string;
    },
    callback: (document: NodeJS.ReadableStream) => void
) {
    const printer = new pdfmake(fonts);
    const pdfDocument = printer.createPdfKitDocument({
        pageMargins: [30, 30, 30, 220],
        content: [
            generateHeader({
                invoiceId: invoiceInformation.invoice.id,
                generationDate: invoiceInformation.generationDate,
            }),

            {
                marginBottom: 8,
                columnGap: 10,
                columns: [
                    {
                        table: {
                            widths: ["auto", "*"],
                            body: [
                                [
                                    "Nombre de usuario",
                                    invoiceInformation.client.firstName,
                                ],
                                [
                                    "Identificación",
                                    invoiceInformation.client.document,
                                ],
                                [
                                    "Número de teléfono",
                                    invoiceInformation.client.phone,
                                ],
                            ],
                        },
                    },
                    {
                        table: {
                            widths: ["auto", "*"],
                            body: [
                                [
                                    "Periodo de facturación",
                                    {
                                        text: [
                                            invoiceInformation.invoice.periodStart.getDay(),
                                            "/",
                                            invoiceInformation.invoice.periodStart.getMonth() +
                                                1,
                                            "/",
                                            invoiceInformation.invoice.periodStart.getFullYear(),
                                            " a ",
                                            invoiceInformation.invoice.periodEnd.getDay(),
                                            "/",
                                            invoiceInformation.invoice.periodEnd.getMonth() +
                                                1,
                                            "/",
                                            invoiceInformation.invoice.periodEnd.getFullYear(),
                                        ],
                                    },
                                ],
                                [
                                    "Pago oportuno",
                                    {
                                        text: [
                                            invoiceInformation.invoice.paymentDate.getDay(),
                                            "/",
                                            invoiceInformation.invoice.paymentDate.getMonth() +
                                                1,
                                            "/",
                                            invoiceInformation.invoice.paymentDate.getFullYear(),
                                        ],
                                    },
                                ],
                                [
                                    "Fecha de suspensión",
                                    {
                                        text: [
                                            invoiceInformation.invoice.suspensionDate.getDay(),
                                            "/",
                                            invoiceInformation.invoice.suspensionDate.getMonth() +
                                                1,
                                            "/",
                                            invoiceInformation.invoice.suspensionDate.getFullYear(),
                                        ],
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            {
                marginBottom: 5,
                text: "Carrera 3 #5 -32 Sector Centro,Junto a la Cooperativa COOMBEL-Linea de Atencion: 3144316001",
            },
            generateContentTable({
                services: invoiceInformation.services,
                invoice: invoiceInformation.invoice,
            }),
        ],
        footer: generateRemovableSection({
            qrCode: invoiceInformation.qrCode,
            invoice: invoiceInformation.invoice,
            client: invoiceInformation.client,
        }),
    });

    callback(pdfDocument);
    pdfDocument.end();
}
