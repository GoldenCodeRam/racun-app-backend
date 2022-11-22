import { Client, Invoice } from "@prisma/client";
import { DynamicContent } from "pdfmake/interfaces";

export function generateRemovableSection(removableSectionInformation: {
    client: Client;
    invoice: Invoice;
}): DynamicContent {
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
                                        removableSectionInformation.invoice.id,
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
                                                        removableSectionInformation.invoice.periodStart.toLocaleString(
                                                            "en-US"
                                                        ),
                                                        " a ",
                                                        removableSectionInformation.invoice.periodEnd.toLocaleString(
                                                            "en-US"
                                                        ),
                                                    ],
                                                },
                                            ],
                                            [
                                                "Pago oportuno",
                                                removableSectionInformation.invoice.paymentDate.toLocaleString(
                                                    "en-US"
                                                ),
                                            ],
                                            [
                                                "Fecha de suspensión",
                                                removableSectionInformation.invoice.suspensionDate.toLocaleString(
                                                    "en-US"
                                                ),
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
                    return i === 0 || i === node.table.body.length ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return i === 0 || i === node.table.widths?.length ? 2 : 0;
                },
                hLineColor: function (_, _node) {
                    return "black";
                },
                vLineColor: function (_, _node) {
                    return "black";
                },
            },
        },
    ];
}
