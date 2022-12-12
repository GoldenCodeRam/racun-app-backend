import { Client, Invoice } from "@prisma/client";
import { Column, Content, DynamicContent, TableCell } from "pdfmake/interfaces";

export function generateRemovableSection(removableSectionInformation: {
    qrCode: string;
    client: Client;
    invoice: Invoice;
}): DynamicContent {
    // FIXME: this is duplicated
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
    });

    return () => [
        {
            margin: [20, 15],
            table: {
                headerRows: 1,
                widths: "*",
                body: [[""], [""]],
            },
            layout: {
                hLineWidth: function (i, _node) {
                    return i === 2 ? 2 : 0;
                },
                vLineWidth: function (_i, _node) {
                    return 0;
                },
                hLineColor: function (_i, _node) {
                    return "gray";
                },
                vLineColor: function (_i, _node) {
                    return "gray";
                },
                hLineStyle: function (_i, _node) {
                    return { dash: { length: 10, space: 4 } };
                },
                vLineStyle: function (_i, _node) {
                    return { dash: { length: 4 } };
                },
            },
        },
        {
            columns: [
                {
                    width: "*",
                    margin: [20, 0],
                    table: {
                        widths: "*",
                        body: [
                            [
                                {
                                    columns: [
                                        {
                                            text: [
                                                "Cuenta de cobro: ",
                                                removableSectionInformation
                                                    .invoice.id,
                                            ],
                                        },
                                        {
                                            text: [
                                                "Fecha: ",
                                                removableSectionInformation.invoice.generationDate.toLocaleString(
                                                    "en-US"
                                                ),
                                            ],
                                        },
                                    ],
                                },
                            ],
                            [
                                {
                                    columnGap: 10,
                                    columns: [
                                        {
                                            table: {
                                                widths: ["auto", "*"],
                                                body: [
                                                    [
                                                        "Nombre de usuario",
                                                        removableSectionInformation
                                                            .client.firstName,
                                                    ],
                                                    [
                                                        "Identificación",
                                                        removableSectionInformation
                                                            .client.document,
                                                    ],
                                                    [
                                                        "Número de teléfono",
                                                        removableSectionInformation
                                                            .client.phone,
                                                    ],
                                                    [
                                                        "Valor",
                                                        formatter.format(removableSectionInformation.invoice.value)
                                                    ],
                                                    [
                                                        "Mora",
                                                        formatter.format(removableSectionInformation.invoice.latePaymentValue)
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
                                                                removableSectionInformation.invoice.periodStart.getDay(),
                                                                "/",
                                                                removableSectionInformation.invoice.periodStart.getMonth() +
                                                                    1,
                                                                "/",
                                                                removableSectionInformation.invoice.periodStart.getFullYear(),
                                                                " a ",
                                                                removableSectionInformation.invoice.periodEnd.getDay(),
                                                                "/",
                                                                removableSectionInformation.invoice.periodEnd.getMonth() +
                                                                    1,
                                                                "/",
                                                                removableSectionInformation.invoice.periodEnd.getFullYear(),
                                                            ],
                                                        },
                                                    ],
                                                    [
                                                        "Pago oportuno",
                                                        {
                                                            text: [
                                                                removableSectionInformation.invoice.paymentDate.getDay(),
                                                                "/",
                                                                removableSectionInformation.invoice.paymentDate.getMonth() +
                                                                    1,
                                                                "/",
                                                                removableSectionInformation.invoice.paymentDate.getFullYear(),
                                                            ],
                                                        },
                                                    ],
                                                    [
                                                        "Fecha de suspensión",
                                                        {
                                                            text: [
                                                                removableSectionInformation.invoice.suspensionDate.getDay(),
                                                                "/",
                                                                removableSectionInformation.invoice.suspensionDate.getMonth() +
                                                                    1,
                                                                "/",
                                                                removableSectionInformation.invoice.suspensionDate.getFullYear(),
                                                            ],
                                                        },
                                                    ],
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 0;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths?.length
                                ? 2
                                : 0;
                        },
                        hLineColor: function (_, _node) {
                            return "black";
                        },
                        vLineColor: function (_, _node) {
                            return "black";
                        },
                    },
                },
                generateQRCode(removableSectionInformation.qrCode),
            ],
        },
    ];
}

function generateQRCode(qrCodeContent: string): Column {
    // TODO: Generate an error if the code is bigger than
    // MAX_QR_CODE_CONTENT_SIZE.
    return {
        width: "auto",
        alignment: "center",
        margin: [0, 0, 20, 0],
        qr: qrCodeContent,
        fit: 100,
        version: 2,
        mask: 7,
        eccLevel: "H",
        mode: "alphanumeric",
    };
}
