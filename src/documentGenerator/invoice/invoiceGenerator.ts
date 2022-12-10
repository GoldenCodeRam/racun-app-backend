import pdfmake from "pdfmake";
import { generateRemovableSection } from "./removable";
import { fonts, images } from "../utils/resources";
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
        pageMargins: [30, 30, 30, 175],
        content: [
            generateHeader({
                qrCode: invoiceInformation.qrCode,
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
                                            invoiceInformation.invoice.periodStart.toLocaleString(
                                                "en-US"
                                            ),
                                            " a ",
                                            invoiceInformation.invoice.periodEnd.toLocaleString(
                                                "en-US"
                                            ),
                                        ],
                                    },
                                ],
                                [
                                    "Pago oportuno",
                                    invoiceInformation.invoice.paymentDate.toLocaleString(
                                        "en-US"
                                    ),
                                ],
                                [
                                    "Fecha de suspensión",
                                    invoiceInformation.invoice.suspensionDate.toLocaleString(
                                        "en-US"
                                    ),
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
            }),
        ],
        footer: generateRemovableSection({
            invoice: invoiceInformation.invoice,
            client: invoiceInformation.client,
        }),
    });

    callback(pdfDocument);
    pdfDocument.end();
}
